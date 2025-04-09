import os
from dotenv import load_dotenv
from rest_framework.exceptions import PermissionDenied
from rest_framework import permissions

# Load environment variables
load_dotenv()

# Get the HOST_IP from the environment
HOST_IP = os.getenv("HOST_IP", "127.0.0.1")  # Default to localhost if not set

class ApiRequestPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        origin = request.META.get('HTTP_ORIGIN', 'Unknown origin')
        referer = request.META.get('HTTP_REFERER', 'Unknown referer')

        # Construct allowed URLs dynamically from HOST_IP
        allowed_origins = [f"https://{HOST_IP}"]
        allowed_referers = [
            f"https://{HOST_IP}/login",
            f"https://{HOST_IP}/logout",
            f"https://{HOST_IP}/register",
        ]

        if origin not in allowed_origins or referer not in allowed_referers:
            raise PermissionDenied(f"You do not have permission to access this resource.")

        return True

class SelfProfilOrReadOnly(permissions.IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS :
            return True
        else:
            return obj.user == request.user 
        

# class SelfCommentOrReadOnly(permissions.IsAdminUser):

#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS :
#             return True
#         else:
#             return obj.user_profil == request.user.profil