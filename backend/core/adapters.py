from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

# Helper function (can be defined here or imported)
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class CustomAccountAdapter(DefaultAccountAdapter):
    def respond_user_inactive(self, request, user):
        # Customize response if user logs in via social but account is inactive
        # Maybe redirect to a page saying "Check your email" etc.
        # For now, let's prevent login if inactive from social too
        from allauth.account.utils import send_email_confirmation
        from django.shortcuts import redirect
        
        # If email verification is mandatory, maybe resend the email
        # if getattr(settings, "ACCOUNT_EMAIL_VERIFICATION", None) == "mandatory":
        #     send_email_confirmation(request, user)
        # return redirect('/inactive-account/') # Redirect to an info page
        
        # Or just prevent login like default
        return super().respond_user_inactive(request, user)


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        """
        Saves a newly signed up social login. Catches auto-signup signals.
        """
        user = super().save_user(request, sociallogin, form)
        # You could add logic here specific to social signup if needed
        # e.g., populate profile fields from social data if they are empty
        # social_data = sociallogin.account.extra_data
        # if not user.first_name and social_data.get('given_name'):
        #     user.first_name = social_data.get('given_name')
        # if not user.last_name and social_data.get('family_name'):
        #     user.last_name = social_data.get('family_name')
        # user.save()
        return user

    def pre_social_login(self, request, sociallogin):
        """
        Invoked just after a user successfully authenticates via a
        social provider, but before the login is actually processed
        (and before any auto-signup occurs).
        We'll use this hook to maybe automatically link accounts or handle inactive users.
        """
        user = sociallogin.user
        if user.id: # If user already exists
            # If the user exists but is inactive, prevent login
            if not user.is_active:
                # Raise exception or handle as needed
                from allauth.account.models import EmailAddress
                if EmailAddress.objects.filter(user=user, verified=False).exists():
                     # Maybe redirect to a page telling them to verify email first?
                     pass # Let CustomAccountAdapter handle inactive response for now
                pass # Or allow login anyway? Depends on your flow.
            return # Let allauth proceed

        # User does not exist, check if email exists with another account
        try:
            from allauth.account.models import EmailAddress
            email = sociallogin.account.extra_data.get('email').lower()
            if email:
                # Check if email is already linked to a local account
                existing_email = EmailAddress.objects.filter(email__iexact=email).first()
                if existing_email and existing_email.verified:
                    # Automatically connect the social account to the existing local user
                    sociallogin.connect(request, existing_email.user)
                    # Note: We don't log them in yet, let allauth continue its flow
                    # which might involve asking for confirmation depending on settings.
                    # This prevents creating a duplicate user.
                    pass # Let allauth handle the connection/login
        except Exception as e:
            # Log error or handle cases where email isn't provided
            print(f"Error during pre_social_login email check: {e}")
            pass

        # If user doesn't exist and email doesn't match an existing verified account,
        # allauth will proceed to auto-signup if configured.

    # --- THIS IS WHERE YOU'D INTEGRATE JWT (More Advanced) ---
    # `django-allauth` doesn't directly support JWT out-of-the-box.
    # Common approaches:
    # 1. Override `allauth` views: Create custom views that inherit from allauth's views
    #    (e.g., GoogleLoginView) and override the success handler to generate and return JWT.
    # 2. Use a library like `dj-rest-auth`: This library builds on allauth and DRF
    #    to provide API endpoints for registration, login (including social), password reset, etc.,
    #    that return JWT tokens. This is often the cleanest solution for APIs.
    # 3. Custom Callback Endpoint: Keep allauth's flow, but after successful login (session created),
    #    redirect the user to a custom frontend route. This route makes a request to a NEW backend
    #    endpoint (e.g., '/api/social-auth-callback/'). This backend endpoint checks the user's
    #    session, verifies they are logged in, generates JWT tokens, and returns them to the frontend.
    #    The frontend then saves the JWT and clears the session cookie (optional).

    # For now, we'll rely on the frontend sending the social token (from Google/MS)
    # to a dedicated backend endpoint (like '/api/google-login/') which will verify it
    # AND generate the JWT. This bypasses much of allauth's session-based login flow
    # for the API interaction.