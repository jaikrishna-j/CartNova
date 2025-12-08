"""
Django management command to create a superuser.
This command creates an admin user if one doesn't exist.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates a superuser from environment variables or uses defaults'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            help='Admin username',
            default=os.environ.get('ADMIN_USERNAME', 'krish'),
        )
        parser.add_argument(
            '--email',
            type=str,
            help='Admin email',
            default=os.environ.get('ADMIN_EMAIL', 'admin@cartnova.com'),
        )
        parser.add_argument(
            '--password',
            type=str,
            help='Admin password',
            default=os.environ.get('ADMIN_PASSWORD', 'krish365'),
        )

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'User "{username}" already exists. Skipping creation.')
            )
            return

        try:
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created superuser "{username}"')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating superuser: {str(e)}')
            )
