from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'users', UserViewSet, 'users')
router.register(r'games', GameViewSet, 'games')
router.register(r'participants', ParticipantViewSet, 'participants')
router.register(r'support-tickets', SupportTicketViewSet, 'support-tickets')
router.register(r'tournament-history', TournamentHistoryViewSet, basename='tournament-history')

urlpatterns = [
    path('', include(router.urls)),
    path("auth/telegram/validate/", TelegramInitAuthView.as_view(), name="telegram-init-auth"),
    path('auth/telegram/', TelegramAuthView.as_view(), name='telegram-auth'),
    path('rating/', RatingView.as_view(), name='rating'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
]