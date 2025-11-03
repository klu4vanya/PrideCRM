from django.contrib.auth.backends import BaseBackend
from .models import Users

class CustomAuthBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = Users.objects.get(email=email)
            if user.check_password(password) and user.is_active:
                return user
        except Users.DoesNotExist:
            return None
        return None
    
    def get_user(self, user_id):
        try:
            return Users.objects.get(user_id=user_id)
        except Users.DoesNotExist:
            return None