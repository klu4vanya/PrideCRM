# views.py

import time
import hmac, hashlib
from django.conf import settings
from django.utils import timezone
from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from dotenv import load_dotenv
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

from .models import Users, Games, Participant
from .serializers import UserSerializer, GameSerializer, ParticipantSerializer
# Проверка подписи Telegram (HMAC-SHA256 по примеру Telegram Login Widget)
def verify_telegram_auth(data: dict, bot_token: str) -> bool:
    if 'hash' not in data:
        return False
    received_hash = data.pop('hash')
    data_check_arr = [f"{k}={v}" for k, v in sorted(data.items())]
    data_check_string = "\n".join(data_check_arr)
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    hmac_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(hmac_hash, received_hash)

def find_user_by_telegram(telegram_data):
    tg_id = telegram_data.get('id')
    tg_username = telegram_data.get('username')
    if tg_id:
        user = Users.objects.filter(user_id=tg_id).first()
        if user:
            return user
    if tg_username:
        return Users.objects.filter(username=tg_username).first()
    return None


class TelegramCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        telegram_data = request.data.get("telegram_data") or {}
        if not telegram_data:
            return Response({"detail": "telegram_data required"}, status=status.HTTP_400_BAD_REQUEST)

        bot_token = getattr(settings, "TELEGRAM_BOT_TOKEN", None)
        if not bot_token:
            return Response({"detail": "Server error: TELEGRAM_BOT_TOKEN not set"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        auth_header = request.headers.get("Authorization")
        expected_header = f"Bearer {bot_token}"
        if auth_header != expected_header:
            return Response({"detail": "Unauthorized bot request"},
                            status=status.HTTP_403_FORBIDDEN)

        # ⚙️ Ищем пользователя
        user = find_user_by_telegram(telegram_data)
        created = False

        if not user:
            username = telegram_data.get("username") or str(telegram_data.get("id"))
            try:
                # создаём без вложенной транзакции
                user = Users.objects.create(
                    username=username,
                    user_id=str(telegram_data.get("id")),
                    first_name=telegram_data.get("first_name", ""),
                    last_name=telegram_data.get("last_name", ""),
                )
                created = True
            except Exception as e:
                return Response({"detail": "Cannot create user", "error": str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 🔒 гарантируем, что пользователь сохранён
        user.save()

        # 🏆 не создаём рейтинг автоматически — по твоему требованию
        # get_or_create_rating(user)

        # 🔑 теперь создаём токен (user гарантированно в БД)
        try:
            token, _ = Token.objects.get_or_create(user=user)
        except Exception as e:
            return Response({"detail": "Cannot create token", "error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = UserSerializer(user)
        return Response(
            {"user": serializer.data, "token": token.key, "is_new": created},
            status=status.HTTP_200_OK
        )

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = "admin" if user.is_staff or user.is_superuser else "user"
        return Response({
            "id": user.user_id,  # ← ИСПОЛЬЗУЙТЕ user_id вместо id
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": role,
        })
class CompleteProfileView(APIView):
    permission_classes = [IsAuthenticated]
    """
    POST /auth/telegram/complete-profile/
    Используется новым пользователем для заполнения дополнительных полей:
    { "first_name": "...", "last_name": "...", "phone": "...", "email": "...", "date_of_birth": "YYYY-MM-DD" }
    """
    def post(self, request):
        user = request.user
        data = request.data
        for field in ('first_name', 'last_name', 'phone', 'email', 'date_of_birth'):
            if field in data:
                setattr(user, field, data[field])
        user.save()
        return Response({"user": UserSerializer(user).data})

class GamesViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    """
    /games/        (GET list)
    /games/{pk}/   (GET retrieve)
    /games/{pk}/register/   (POST — зарегистрироваться на игру)
    /games/{pk}/unregister/ (POST — отписаться от игры)
    """
    def list(self, request):
        qs = Games.objects.all().order_by('date', 'time')
        serializer = GameSerializer(qs, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        game = get_object_or_404(Games, pk=pk)
        serializer = GameSerializer(game)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        user = request.user
        if user.is_banned:
            return Response({"detail": "User banned"}, status=status.HTTP_403_FORBIDDEN)
        game = get_object_or_404(Games, pk=pk)
        try:
            Participant.objects.create(user=user, tournament=game)
        except IntegrityError:
            return Response({"detail": "Already registered"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "registered"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def unregister(self, request, pk=None):
        user = request.user
        game = get_object_or_404(Games, pk=pk)
        part = Participant.objects.filter(user=user, tournament=game).first()
        if not part:
            return Response({"detail": "Not registered"}, status=status.HTTP_400_BAD_REQUEST)
        part.delete()
        return Response({"detail": "unregistered"})

class ParticipantViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    """
    /participants/ (GET)
    Admin: все записи, пользователь: только его участия.
    """
    def list(self, request):
        if request.user.is_admin:
            qs = Participant.objects.select_related('user', 'tournament').all()
        else:
            qs = Participant.objects.select_related('user', 'tournament').filter(user=request.user)
        serializer = ParticipantSerializer(qs, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        part = get_object_or_404(Participant, pk=pk)
        if part.user != request.user and not request.user.is_admin:
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        serializer = ParticipantSerializer(part)
        return Response(serializer.data)

class RatingListView(APIView):
    permission_classes = [IsAuthenticated]
    """
    GET /rating/ — список всех пользователей и очков по убыванию (с ранжированием).
    """
    def get(self, request):
        ratings = Users.objects.order_by('-points')
        data = []
        for i, r in enumerate(ratings, start=1):
            data.append({
                "rank": i,
                "user": UserSerializer(r).data,
            })
        return Response(data)

# class AdminRatingView(APIView):
#     permission_classes = [IsAuthenticated]
#     """
#     POST /admin/rating/{user_id}/ 
#     Тело: {"delta": int} или {"set": int}
#     Изменяет очки пользователя (только для админа).
#     """
#     def post(self, request, user_id):
#         if not request.user.is_admin:
#             return Response({"detail": "admin only"}, status=status.HTTP_403_FORBIDDEN)
#         target = get_object_or_404(Users, pk=user_id)
#         delta = request.data.get('delta')
#         setv = request.data.get('set')
#         if delta is None and setv is None:
#             return Response({"detail": "Provide 'delta' or 'set'"}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             if delta is not None:
#                 target.points += int(delta)
#             if setv is not None:
#                 target.points = int(setv)
#         except (ValueError, TypeError):
#             return Response({"detail": "Values must be integers"}, status=status.HTTP_400_BAD_REQUEST)
#         target.save()
#         return Response({"detail": "rating updated", "user": UserSerializer(target).data})

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    """
    GET /profile/ — данные текущего пользователя + его очки и место в рейтинге.
    """
    def get(self, request):
        user = request.user
        all_ratings = list(Users.objects.order_by('-points'))
        rank = next((i + 1 for i, r in enumerate(all_ratings) if r.user_id == user.user_id), None)
        return Response({
            "user": UserSerializer(user).data,
            "rank": rank
        })

class AdminUsersViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    """
    /admin/users/       (GET list all users)
    /admin/users/{id}/  (GET retrieve, PATCH partial_update)
    Доступ только для админов (is_admin=True).
    """
    def _ensure_admin(self, request):
        if not request.user.is_admin:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("admin only")

    def list(self, request):
        self._ensure_admin(request)
        qs = Users.objects.all()
        serializer = UserSerializer(qs, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        self._ensure_admin(request)
        user = get_object_or_404(Users, pk=pk)
        return Response(UserSerializer(user).data)

    def partial_update(self, request, pk=None):
        self._ensure_admin(request)
        user = get_object_or_404(Users, pk=pk)
        for field, value in request.data.items():
            if hasattr(user, field):
                setattr(user, field, value)
        user.save()
        return Response(UserSerializer(user).data)
