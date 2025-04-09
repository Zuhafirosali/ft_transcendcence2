from django.contrib.auth.models import User
from user.models import Profil, ProfileComment
from django.db.models.signals import post_save
from django.dispatch import receiver
import os
from django.conf import settings
from django.core.files import File


@receiver(post_save, sender=User)
def create_profil(sender, instance, created, **kwargs):
	print(instance.username , '__Created: ', created )
	if created:
		Profil.objects.create(user=instance)
		if(instance.username == 'TeamGlobal'):
			profilePolice = Profil.objects.get(user=instance)
			profilePolice.bio = 'I AM HERE 24/7!'
			profilePolice.city = 'Abu Dhabi'
			static_file_path = os.path.join(settings.BASE_DIR, 'uploads', 'profil_photo', 'photo.png')
			with open(static_file_path, 'rb') as f:
				profilePolice.photo.save('photo.png', File(f))
			profilePolice.save()

@receiver(post_save, sender=Profil)
def create_first_durum(sender, instance, created, **kwargs):
	print(instance.user.username , '__Created: ', created )
	if created:
		ProfileComment.objects.create(
			user_profil = instance,
			comment_text = f'{instance.user.username} Enjoy The Game from TeamGlobal',
		)
