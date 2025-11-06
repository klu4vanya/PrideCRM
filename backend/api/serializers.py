from rest_framework import serializers
from .models import Users, Games, Participant, SupportTicket

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = [
            'user_id', 'username', 'nick_name', 'first_name', 'last_name',
            'phone_number', 'email', 'date_of_birth', 'points', 
            'total_games_played', 'is_banned', 'created_at'
        ]
        read_only_fields = ['user_id', 'username', 'points', 'total_games_played', 'created_at']

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_id', 'username', 'first_name', 'last_name']

class GameSerializer(serializers.ModelSerializer):
    participants_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Games
        fields = [
            'game_id', 'date', 'time', 'description', 'buyin', 'reentry_buyin',
            'location', 'photo', 'is_active', 'participants_count',
            'base_points', 'points_per_extra_player', 'min_players_for_extra_points'
        ]
    
    def get_participants_count(self, obj):
        return obj.participants.count()

class ParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.CharField(write_only=True)
    
    class Meta:
        model = Participant
        fields = [
            'id', 'user', 'user_id', 'game', 'entries', 'rebuys', 
            'addons', 'final_points', 'position', 'joined_at'
        ]
        read_only_fields = ['user', 'game']

class ParticipantDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    game = GameSerializer(read_only=True)
    
    class Meta:
        model = Participant
        fields = '__all__'

class SupportTicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']