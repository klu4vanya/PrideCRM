# urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as drf_token
from .views import (
    MeView, TelegramCallbackView, CompleteProfileView,
    GamesViewSet, ParticipantViewSet,
    ProfileView, AdminUsersViewSet, RatingListView
)

router = DefaultRouter()
router.register(r'games', GamesViewSet, basename='games')
router.register(r'participants', ParticipantViewSet, basename='participants')
router.register(r'admin/users', AdminUsersViewSet, basename='admin-users')

urlpatterns = [
    # Получение токена по логину-паролю (опционально)
    path('api-token-auth/', drf_token.obtain_auth_token),
    path("me/", MeView.as_view(), name="me"),

    # Telegram авторизация
    path('auth/telegram/callback/', TelegramCallbackView.as_view(), name='telegram-callback'),
    path('auth/telegram/complete-profile/', CompleteProfileView.as_view(), name='telegram-complete-profile'),

    # Профиль и рейтинг
    path('profile/', ProfileView.as_view(), name='profile'),
    path('rating/', RatingListView.as_view(), name='rating-list'),

    # Остальные эндпоинты через роутер
    path('', include(router.urls)),
]
