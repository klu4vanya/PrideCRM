from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UsersManager(BaseUserManager):
    def create_user(self, user_id, username, **extra_fields):
        if not user_id:
            raise ValueError("User ID is required")
        if not username:
            raise ValueError("Username is required")

        user = self.model(user_id=user_id, username=username, **extra_fields)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_id, username, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(user_id, username, **extra_fields)

class Users(AbstractBaseUser, PermissionsMixin):
    user_id = models.CharField(max_length=64, unique=True, primary_key=True)
    username = models.CharField(max_length=100)
    nick_name = models.CharField(max_length=100, blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    
    # Статистика
    points = models.IntegerField(default=0, null=True)
    total_games_played = models.IntegerField(default=0)
    
    # Флаги
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_banned = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UsersManager()
    USERNAME_FIELD = 'user_id'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.username} ({self.user_id})"

class Games(models.Model):
    game_id = models.AutoField(primary_key=True)
    date = models.DateField()
    time = models.TimeField()
    description = models.TextField(blank=True)
    buyin = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    reentry_buyin = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    location = models.CharField(max_length=255, blank=True)
    photo = models.ImageField(upload_to='games/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Для рейтинговой системы
    base_points = models.IntegerField(default=100)  # Базовая гарантия очков
    points_per_extra_player = models.IntegerField(default=10)  # + очков за каждого дополнительного игрока
    min_players_for_extra_points = models.IntegerField(default=10)  # Минимальное количество игроков для бонуса

    class Meta:
        db_table = 'games'
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.date} - {self.description}"

class Participant(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='participations')
    game = models.ForeignKey(Games, on_delete=models.CASCADE, related_name='participants')
    entries = models.IntegerField(default=1)  # Количество входов
    rebuys = models.IntegerField(default=0)   # Количество ребаев
    addons = models.IntegerField(default=0)   # Количество аддонов
    final_points = models.IntegerField(default=0)  # Начисленные очки за эту игру
    position = models.IntegerField(null=True, blank=True)  # Место в турнире
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'participants'
        unique_together = ('user', 'game')

    def __str__(self):
        return f"{self.user.username} -> {self.game}"

class SupportTicket(models.Model):
    TICKET_STATUS = [
        ('open', 'Открыт'),
        ('in_progress', 'В работе'),
        ('closed', 'Закрыт'),
    ]
    
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=TICKET_STATUS, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'support_tickets'
        ordering = ['-created_at']


class TournamentHistory(models.Model):
    """История завершенных турниров"""
    game = models.OneToOneField(
        Games, 
        on_delete=models.CASCADE,
        related_name='history',
        help_text="Связь с завершенной игрой"
    )
    date = models.DateField(help_text="Дата проведения турнира")
    time = models.TimeField(null=True, blank=True, help_text="Время начала")
    tournament_name = models.CharField(max_length=255, help_text="Название турнира")
    location = models.CharField(max_length=255, help_text="Локация")
    buyin = models.IntegerField(help_text="Buy-in")
    reentry_buyin = models.IntegerField(null=True, blank=True, help_text="Re-entry buy-in")
    
    total_revenue = models.IntegerField(default=0, help_text="Общая выручка")
    participants_count = models.IntegerField(default=0, help_text="Количество участников")
    
    completed_at = models.DateTimeField(auto_now_add=True, help_text="Дата завершения")
    
    class Meta:
        ordering = ['-date', '-time']
        verbose_name = "История турнира"
        verbose_name_plural = "История турниров"
    
    def __str__(self):
        return f"{self.tournament_name} - {self.date}"


class TournamentParticipant(models.Model):
    """Участник завершенного турнира"""
    
    PAYMENT_METHODS = [
        ('cash_ivan', 'Наличные Иван'),
        ('cash_petr', 'Наличные Петр'),
        ('qr_code', 'QR код'),
        ('card', 'Картой'),
    ]
    
    tournament_history = models.ForeignKey(
        TournamentHistory,
        on_delete=models.CASCADE,
        related_name='participants'
    )
    
    # Сохраняем данные игрока на момент турнира
    user_id = models.CharField(max_length=100, help_text="Telegram ID")
    username = models.CharField(max_length=100, help_text="Username")
    first_name = models.CharField(max_length=100, help_text="Имя")
    last_name = models.CharField(max_length=100, blank=True, help_text="Фамилия")
    
    # Статистика
    entries = models.IntegerField(default=1, help_text="Количество входов")
    rebuys = models.IntegerField(default=0, help_text="Количество ребаев")
    addons = models.IntegerField(default=0, help_text="Количество аддонов")
    
    total_spent = models.IntegerField(default=0, help_text="Всего потрачено")
    
    class Meta:
        verbose_name = "Участник турнира"
        verbose_name_plural = "Участники турнира"
    
    def __str__(self):
        return f"{self.first_name} ({self.username}) - {self.tournament_history.tournament_name}"