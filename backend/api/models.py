# models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import AbstractUser
# Если у вас уже есть Users-модель — либо замените эту, либо объедините поля.
# Этот пример реализует простую кастомную user модель, удобную для интеграции с DRF Token.
# Настройте settings.AUTH_USER_MODEL = 'yourapp.Users'

class UsersManager(BaseUserManager):
    def create_user(self, username, user_id, email=None, **extra_fields):
        if not username:
            raise ValueError("Username is required")
        if not user_id:
            raise ValueError("Telegram user_id is required")

        user = self.model(username=username, user_id=user_id, email=self.normalize_email(email), **extra_fields)
        user.set_password(extra_fields.get("password", ""))
        user.save(using=self._db)
        return user

    def create_superuser(self, username, user_id="admin", email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        user = self.create_user(username=username, user_id=user_id, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class Users(AbstractBaseUser, PermissionsMixin):
    """Пользователи с авторизацией через Telegram"""

    user_id = models.CharField(max_length=64, unique=True, primary_key=True)
    username = models.CharField(max_length=100, unique=True, null=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    photo_id = models.CharField(max_length=256, blank=True, null=True)
    points = models.IntegerField(default=0, blank=True, null=False)
    # флаги
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_banned = models.BooleanField(default=False)

    objects = UsersManager()

    USERNAME_FIELD = 'user_id'   # ← обязательно
    # REQUIRED_FIELDS = ['user_id']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username or f"User {self.user_id}"



class Games(models.Model):
    """
    Игры/турниры.
    Соответствует существующей структуре таблицы
    """
    game_id = models.AutoField(primary_key=True)
    date = models.CharField(max_length=50)  # TEXT в SQLite
    description = models.TextField(blank=True)
    time = models.CharField(max_length=50, blank=True, null=True)  # TEXT в SQLite
    buyin = models.CharField(max_length=50, blank=True, default='0')  # TEXT в SQLite
    location = models.CharField(max_length=255, blank=True)
    photo_id = models.CharField(max_length=1024, blank=True, null=True)
    reentry_buyin = models.CharField(max_length=50, blank=True, default='0')  # TEXT в SQLite

    class Meta:
        db_table = 'games'
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.date} {self.description[:50]}"


class Participant(models.Model):
    """
    Участник турнира.
    """
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='participants')
    tournament = models.ForeignKey(Games, on_delete=models.CASCADE, related_name='participants')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'participants'
        unique_together = ('user', 'tournament')

    def __str__(self):
        return f"{self.user.username} -> {self.tournament.id}"
