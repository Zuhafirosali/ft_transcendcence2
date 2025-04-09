from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.contrib.auth import get_user_model

class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user'

    def ready(self):
        import user.signals
        post_migrate.connect(create_default_user)

def create_default_user(sender, **kwargs):
    User = get_user_model()
    if not User.objects.filter(username='TeamGlobal').exists():
        User.objects.create_user(
            username='TeamGlobal',
            password='TeamGlobal',
            email='TeamGlobal@127.0.0.1',
            first_name='TeamGlobal',
            last_name='42 abu dhbai',
        )
