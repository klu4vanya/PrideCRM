from rest_framework import serializers
from .models import Users, Games, Participant, SupportTicket

# -------------------
# Пользователи
# -------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = [
            'user_id', 'username', 'nick_name', 'first_name', 'last_name',
            'phone_number', 'email', 'date_of_birth', 'points', 
            'total_games_played', 'is_admin', 'is_banned', 'created_at'
        ]
        read_only_fields = ['user_id', 'created_at']


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_id', 'username', 'first_name', 'last_name', 'phone_number', 'email']


# -------------------
# Игры
# -------------------
class ParticipantShortSerializer(serializers.ModelSerializer):
    """Короткий сериализатор участника для включения в GameSerializer"""
    user = UserSerializer(read_only=True)

    class Meta:
        model = Participant
        fields = ['id', 'user', 'position', 'final_points']


class GameSerializer(serializers.ModelSerializer):
    participants_count = serializers.SerializerMethodField()
    participants_details = ParticipantShortSerializer(many=True, read_only=True, source='participants')

    class Meta:
        model = Games
        fields = [
            'game_id', 'date', 'time', 'description', 'buyin', 'reentry_buyin',
            'location', 'photo', 'is_active', 'participants_count', 'participants_details',
            'base_points', 'points_per_extra_player', 'min_players_for_extra_points'
        ]

    def get_participants_count(self, obj):
        return obj.participants.count()


class GameCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Games
        fields = [
            'date', 'time', 'description', 'buyin', 'reentry_buyin',
            'location', 'photo', 'base_points', 'points_per_extra_player', 
            'min_players_for_extra_points'
        ]


# -------------------
# Участники
# -------------------
class ParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.CharField(write_only=True)

    class Meta:
        model = Participant
        fields = [
            'id', 'user', 'user_id', 'game', 'entries', 'rebuys', 
            'addons', 'final_points', 'position', 'joined_at'
        ]
        read_only_fields = ['game']


class ParticipantDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор участника (без рекурсивной игры)"""
    user = UserSerializer(read_only=True)

    class Meta:
        model = Participant
        fields = '__all__'


class ParticipantAdminSerializer(serializers.ModelSerializer):
    """Сериализатор для админского управления участниками"""
    user_info = serializers.SerializerMethodField()

    class Meta:
        model = Participant
        fields = [
            'id', 'user', 'user_info', 'game', 'entries', 'rebuys', 
            'addons', 'final_points', 'position', 'joined_at'
        ]

    def get_user_info(self, obj):
        return {
            'user_id': obj.user.user_id,
            'username': obj.user.username,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name
        }


# -------------------
# Тикеты поддержки
# -------------------
class SupportTicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
