# serializers.py
from rest_framework import serializers
from .models import Users, Games, Participant

class UserSerializer(serializers.ModelSerializer):
    # points = serializers.SerializerMethodField()

    class Meta:
        model = Users
        # перечисляем поля, которые хотим отдавать клиенту
        fields = [
            'user_id',      # Telegram ID
            'username',
            'first_name',
            'last_name',
            'phone',
            'email',
            'date_of_birth',
            'is_admin',
            'is_banned',
            'points',
        ]

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Games
        fields = ['date', 'time', 'description', 'buyin', 'location', 'photo_id', 'reentry_buyin']


class ParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    tournament = GameSerializer(read_only=True)

    class Meta:
        model = Participant
        fields = ['id', 'user', 'tournament', 'joined_at']
