from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.filter(is_superuser=True).first()
if u:
    u.set_password('Admin1234!')
    u.save()
    print(f"La contraseña para el usuario '{u.username}' ha sido cambiada a 'Admin1234!'")
else:
    print("No se encontraron usuarios administradores.")
