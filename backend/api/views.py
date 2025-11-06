from datetime import timezone
import logging
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
    serializer_class = UserSerializer
    
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

class GameViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Games.objects.filter(is_active=True)
    serializer_class = GameSerializer
    
    def get_queryset(self):
        if self.request.user.is_admin:
            return Games.objects.all()
        return Games.objects.filter(is_active=True)
    
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
    
    @action(detail=True, methods=['post'])
    def add_participant(self, request, pk=None):
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
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        game = self.get_object()
        participants = Participant.objects.filter(game=game).select_related('user')
        
        # Автоматический расчет очков на основе алгоритма
        total_players = participants.count()
        base_points = game.base_points
        
        # Расчет бонусных очков
        if total_players > game.min_players_for_extra_points:
            extra_players = total_players - game.min_players_for_extra_points
            total_points = base_points + (extra_players * game.points_per_extra_player)
        else:
            total_points = base_points
        
        # Распределение очков (простая схема - можно усложнить)
        results_data = []
        for i, participant in enumerate(participants.order_by('position')):
            # Простое распределение: 1 место - 40%, 2 - 30%, 3 - 20%, остальные - 10%
            if i == 0:  # 1 место
                points_earned = int(total_points * 0.4)
            elif i == 1:  # 2 место
                points_earned = int(total_points * 0.3)
            elif i == 2:  # 3 место
                points_earned = int(total_points * 0.2)
            else:  # Остальные
                points_earned = int(total_points * 0.1 / max(1, (total_players - 3)))
            
            participant.final_points = points_earned
            participant.save()
            
            # Обновляем общие очки пользователя
            participant.user.points += points_earned
            participant.user.total_games_played += 1
            participant.user.save()
            
            results_data.append({
                'user': UserSerializer(participant.user).data,
                'entries': participant.entries,
                'rebuys': participant.rebuys,
                'addons': participant.addons,
                'position': participant.position,
                'points_earned': points_earned
            })
        
        return Response({
            'game': GameSerializer(game).data,
            'total_players': total_players,
            'total_points_distributed': total_points,
            'results': results_data
        })

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