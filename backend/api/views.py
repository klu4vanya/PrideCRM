from django.utils import timezone
import logging
import hashlib
from django.conf import settings
from rest_framework.response import Response
from urllib.parse import parse_qsl
import hmac
import json
from rest_framework.authtoken.models import Token
from django.db.models import Q, Count, Sum
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Users, Games, Participant, SupportTicket
from .serializers import *

logger = logging.getLogger(__name__)

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_admin

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_admin
import hmac
import hashlib
from urllib.parse import parse_qsl
import json
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

class TelegramInitAuthView(APIView):
    permission_classes = []

    def post(self, request):
        # print(f"Request data: {request.data}")

        from logging import Logger

        l = Logger("arsfg")
        l.warning("=== TELEGRAM AUTH DEBUG ===")
        l.warning(f"Request data: {request.data}")
        
        init_data = request.data.get("initData")
        if not init_data:
            return Response({"error": "Missing initData"}, status=400)

        try:
            # Парсим initData
            parsed_data = dict(parse_qsl(init_data))
            l.warning(f"Parsed data keys: {list(parsed_data.keys())}")
            
            # Получаем данные пользователя (пропускаем валидацию для теста)
            user_json = parsed_data.get("user")
            if not user_json:
                return Response({"error": "Missing user data"}, status=400)

            user_data = json.loads(user_json)
            l.warning(f"User data: {user_data}")

            telegram_id = str(user_data["id"])
            username = user_data.get("username", f"user_{telegram_id}")
            first_name = user_data.get("first_name", "")
            last_name = user_data.get("last_name", "")

            l.warning(f"Looking for user with telegram_id: {telegram_id}")

            # Создаём или обновляем пользователя
            user, created = Users.objects.get_or_create(
                user_id=telegram_id,
                defaults={
                    "username": username,
                    "first_name": first_name,
                    "last_name": last_name,
                }
            )

            l.warning(f"User created: {created}")
            l.warning(f"User object: {user}")
            l.warning(f"User username: {user.username}")

            # ДИАГНОСТИКА: Проверяем существование токена
            from rest_framework.authtoken.models import Token
            
            # Проверяем есть ли уже токен
            existing_token = Token.objects.filter(user=user).first()
            if existing_token:
                l.warning(f"Existing token found: {existing_token.key}")
                token = existing_token
            else:
                # Создаем новый токен
                token = Token.objects.create(user=user)
                l.warning(f"New token created: {token.key}")

            # Формируем ответ
            response_data = {
                "token": token.key,
                "user": {
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "telegram_id": user.user_id,
                }
            }

            # Добавляем id если есть
            if hasattr(user, 'id'):
                response_data["user"]["id"] = user.id
            elif hasattr(user, 'user_id'):
                response_data["user"]["id"] = user.user_id

            l.warning(f"Final response data: {response_data}")

            return Response(response_data)

        except Exception as e:
            l.warning(f"ERROR in auth: {str(e)}")
            import traceback
            l.warning(f"Traceback: {traceback.format_exc()}")
            return Response({"error": f"Auth failed: {str(e)}"}, status=500)

class TelegramAuthView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        telegram_data = request.data.get("telegram_data")
        if not telegram_data:
            return Response({"error": "Telegram data required"}, status=400)
        
        user_id = str(telegram_data.get('id'))
        username = telegram_data.get('username')
        first_name = telegram_data.get('first_name', '')
        last_name = telegram_data.get('last_name', '')
        
        try:
            user, created = Users.objects.get_or_create(
                user_id=user_id,
                defaults={
                    'username': username or user_id,
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )
            
            if created:
                logger.info(f"New user created: {user_id}")
            else:
                # Обновляем базовую информацию при каждом входе
                user.first_name = first_name
                user.last_name = last_name
                if username:
                    user.username = username
                user.save()
            
            # Создаем или получаем токен
            from rest_framework.authtoken.models import Token
            token, _ = Token.objects.get_or_create(user=user)
            
            return Response({
                "token": token.key,
                "user": UserSerializer(user).data,
                "is_new": created
            })
            
        except Exception as e:
            logger.error(f"Telegram auth error: {str(e)}")
            return Response({"error": "Authentication failed"}, status=500)

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = Users.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=True, methods=['post'])
    def ban(self, request, pk=None):
        user = self.get_object()
        user.is_banned = True
        user.save()
        return Response({"status": "user banned"})
    
    @action(detail=True, methods=['post'])
    def unban(self, request, pk=None):
        user = self.get_object()
        user.is_banned = False
        user.save()
        return Response({"status": "user unbanned"})
    
    @action(detail=True, methods=['post'])
    def add_points(self, request, pk=None):
        user = self.get_object()
        points = request.data.get('points', 0)
        
        try:
            points = int(points)
            user.points += points
            user.save()
            return Response({
                "status": "points added",
                "new_points": user.points
            })
        except ValueError:
            return Response({"error": "Invalid points value"}, status=400)
        
class TournamentHistoryViewSet(viewsets.ModelViewSet):
    """История завершенных турниров"""
    permission_classes = [IsAdminUser]
    queryset = TournamentHistory.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TournamentHistoryListSerializer
        return TournamentHistorySerializer
    
    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        """Получить участников турнира"""
        tournament = self.get_object()
        participants = tournament.participants.all()
        serializer = TournamentParticipantSerializer(participants, many=True)
        return Response(serializer.data)


class GameViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        if self.request.user.is_admin:
            return Games.objects.all()
        return Games.objects.filter(is_active=True)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return GameCreateSerializer
        return GameSerializer
    
    def perform_destroy(self, instance):
        # instance.is_active = False
        instance.delete()
        # instance.save()
    
    @action(detail=True, methods=['get'])
    def participants_admin(self, request, pk=None):
        """Получение всех участников игры для админа"""
        if not request.user.is_admin:
            return Response({"error": "Admin access required"}, status=403)
        
        game = self.get_object()
        participants = Participant.objects.filter(game=game).select_related('user')
        serializer = ParticipantAdminSerializer(participants, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_participant_admin(self, request, pk=None):
        """Добавление участника админом"""
        if not request.user.is_admin:
            return Response({"error": "Admin access required"}, status=403)
        
        game = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = Users.objects.get(user_id=user_id)
        except Users.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        
        participant, created = Participant.objects.get_or_create(
            user=user,
            game=game,
            defaults={
                'entries': request.data.get('entries', 1),
                'rebuys': request.data.get('rebuys', 0),
                'addons': request.data.get('addons', 0),
            }
        )
        
        if not created:
            participant.entries = request.data.get('entries', participant.entries)
            participant.rebuys = request.data.get('rebuys', participant.rebuys)
            participant.addons = request.data.get('addons', participant.addons)
            participant.save()
        
        serializer = ParticipantDetailSerializer(participant)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def remove_participant_admin(self, request, pk=None):
        """Удаление участника админом"""
        if not request.user.is_admin:
            return Response({"error": "Admin access required"}, status=403)
        
        game = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = Users.objects.get(user_id=user_id)
            participant = Participant.objects.get(user=user, game=game)
            participant.delete()
            return Response({"status": "participant removed"})
        except Users.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Participant.DoesNotExist:
            return Response({"error": "Participant not found"}, status=404)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def complete(self, request, pk=None):
        """Завершить игру и создать запись в истории"""
        game = self.get_object()
        participants_data = request.data.get('participants', [])
        
        try:
            # Создаем запись в истории турнира
            tournament_history = TournamentHistory.objects.create(
                game=game,
                date=game.date,
                time=game.time,
                tournament_name=game.description or f"Турнир {game.date}",
                location=game.location,
                buyin=game.buyin,
                reentry_buyin=game.reentry_buyin or game.buyin,
                participants_count=len(participants_data)
            )
            
            total_revenue = 0
            
            # Создаем записи участников
            for p_data in participants_data:
                user = Users.objects.get(pk=p_data['user_id'])
                
                entries = p_data.get('entries', 1)
                rebuys = p_data.get('rebuys', 0)
                addons = p_data.get('addons', 0)
                
                # Рассчитываем затраты участника
                buyin_cost = entries * game.buyin
                rebuy_cost = rebuys * (game.reentry_buyin or game.buyin)
                addon_cost = addons * (game.reentry_buyin or game.buyin)
                total_spent = buyin_cost + rebuy_cost + addon_cost
                
                total_revenue += total_spent
                
                TournamentParticipant.objects.create(
                    tournament_history=tournament_history,
                    user_id=user.user_id,
                    username=user.username,
                    first_name=user.first_name,
                    last_name=user.last_name,
                    entries=entries,
                    rebuys=rebuys,
                    addons=addons,
                    total_spent=total_spent,
                    position=p_data.get('position'),
                    prize=p_data.get('prize', 0)
                )
            
            # Обновляем общую выручку
            tournament_history.total_revenue = total_revenue
            tournament_history.save()
            
            # Помечаем игру как завершенную
            game.is_active = False
            game.completed = True
            game.completed_at = timezone.now()
            game.save()
            
            serializer = TournamentHistorySerializer(tournament_history)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error completing game: {str(e)}")
            return Response(
                {"error": f"Failed to complete game: {str(e)}"}, 
                status=500
            )
    
    @action(detail=True, methods=['post'])
    def update_participant_admin(self, request, pk=None):
        """Обновление данных участника админом"""
        if not request.user.is_admin:
            return Response({"error": "Admin access required"}, status=403)
        
        game = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = Users.objects.get(user_id=user_id)
            participant = Participant.objects.get(user=user, game=game)
            
            # Обновляем поля
            if 'entries' in request.data:
                participant.entries = request.data['entries']
            if 'rebuys' in request.data:
                participant.rebuys = request.data['rebuys']
            if 'addons' in request.data:
                participant.addons = request.data['addons']
            if 'position' in request.data:
                participant.position = request.data['position']
            if 'final_points' in request.data:
                participant.final_points = request.data['final_points']
            
            participant.save()
            serializer = ParticipantDetailSerializer(participant)
            return Response(serializer.data)
            
        except Users.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Participant.DoesNotExist:
            return Response({"error": "Participant not found"}, status=404)

class ParticipantViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ParticipantDetailSerializer
    
    def get_queryset(self):
        if self.request.user.is_admin:
            return Participant.objects.all()
        return Participant.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        game_id = request.data.get('game_id')
        try:
            game = Games.objects.get(pk=game_id, is_active=True)
        except Games.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)
        
        if request.user.is_banned:
            return Response({"error": "User is banned"}, status=403)
        
        participant, created = Participant.objects.get_or_create(
            user=request.user,
            game=game
        )
        
        if created:
            return Response({"status": "registered"}, status=201)
        else:
            return Response({"status": "already registered"})
        
    @action(detail=False, methods=['delete'])
    def unregister(self, request):
        """Отмена регистрации на игру через DELETE"""
        game_id = request.data.get('game_id')
        
        try:
            game = Games.objects.get(pk=game_id, is_active=True)
        except Games.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)
        
        try:
            participant = Participant.objects.get(
                user=request.user,
                game=game
            )
            participant.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Participant.DoesNotExist:
            return Response({"error": "Not registered for this game"}, status=404)

class RatingView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        users = Users.objects.filter(is_banned=False).order_by('-points')
        ranked_users = []
        
        for rank, user in enumerate(users, start=1):
            ranked_users.append({
                'rank': rank,
                'user': UserSerializer(user).data,
                'points': user.points,
                'games_played': user.total_games_played
            })
        
        return Response(ranked_users)

class SupportTicketViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SupportTicketSerializer
    
    def get_queryset(self):
        if self.request.user.is_admin:
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data
        l = logging.Logger("arsfg")
        l.warning("=== TELEGRAM PROFILE DEBUG ===")
        l.warning(f"Request data: {user_data}")
        
        # Получаем ближайшие игры, на которые зарегистрирован пользователь
        upcoming_participations = Participant.objects.filter(
            user=user,
            game__date__gte=timezone.now().date()
        ).select_related('game')[:5]
        
        return Response({
            'user': user_data,
            'upcoming_games': GameSerializer(
                [p.game for p in upcoming_participations], 
                many=True
            ).data
        })
    
    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class AdminDashboardView(APIView):
    """Дашборд для администратора"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        admin_info = {
            'is_admin': UserSerializer(user).data["is_admin"]
        }
        stats = {
            'total_users': Users.objects.count(),
            'total_games': Games.objects.count(),
            'active_games': Games.objects.filter(is_active=True).count(),
            'banned_users': Users.objects.filter(is_banned=True).count(),
            'total_participants': Participant.objects.count(),
            'open_tickets': SupportTicket.objects.filter(status='open').count(),
        }
        
        recent_games = Games.objects.order_by('-created_at')[:5]
        recent_users = Users.objects.order_by('-created_at')[:5]
        
        return Response({
            'admin_info': admin_info,
            'stats': stats,
            'recent_games': GameSerializer(recent_games, many=True).data,
            'recent_users': UserSerializer(recent_users, many=True).data
        })