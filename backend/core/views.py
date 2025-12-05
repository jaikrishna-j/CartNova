from django.conf import settings
import requests
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from allauth.socialaccount.models import SocialAccount, SocialApp

# Imports for Google Auth Code Flow
from google_auth_oauthlib.flow import Flow
from google.oauth2 import credentials # Implicitly used by flow.fetch_token
from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2.rfc6749.errors import OAuth2Error
import traceback # For detailed error logging

CustomerUser = get_user_model()

# Helper function to get JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Handles standard user registration requests via form submission.
    Includes reCAPTCHA validation.
    Creates an active user immediately and returns authentication tokens.
    """
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)

        # --- reCAPTCHA Verification ---
        recaptcha_response = request.data.get('g-recaptcha-response')
        if not recaptcha_response:
            return Response({"recaptcha": ["Please complete the CAPTCHA."]}, status=status.HTTP_400_BAD_REQUEST)
        try:
            data = {
                'secret': settings.GOOGLE_RECAPTCHA_SECRET_KEY,
                'response': recaptcha_response
            }
            verify_request = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data, timeout=5)
            verify_request.raise_for_status()
            result = verify_request.json()
        except requests.exceptions.RequestException as e:
            print(f"Error during reCAPTCHA verification request: {e}")
            return Response({"recaptcha": ["Could not verify CAPTCHA due to a network issue."]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(f"Unexpected error during reCAPTCHA verification: {e}")
            return Response({"recaptcha": ["An unexpected error occurred during CAPTCHA verification."]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not result.get('success'):
            print(f"reCAPTCHA verification failed by Google: {result.get('error-codes')}")
            return Response({"recaptcha": ["reCAPTCHA verification failed."]}, status=status.HTTP_400_BAD_REQUEST)
        # --- End reCAPTCHA Verification ---

        if serializer.is_valid():
            try:
                user = serializer.save() # User is created as active
                tokens = get_tokens_for_user(user) # Generate tokens
                return Response({
                    "message": "Registration successful!",
                    "access": tokens['access'],
                    "refresh": tokens['refresh'],
                    "user": {"username": user.username, "email": user.email}
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Error saving user or generating tokens: {e}")
                return Response({"detail": "An internal error occurred during registration."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({"detail": "Method \"GET\" not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    """
    Handles login/signup via Google OAuth2 authorization code sent from frontend.
    Exchanges the code for tokens, verifies the ID token, finds or creates a user,
    links the social account, and returns JWT tokens.
    """
    auth_code = request.data.get('code') # Expect 'code' from frontend
    if not auth_code:
        return Response({"error": "Google authorization code not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # --- Get Google App Config from Allauth Admin ---
        try:
            google_app = SocialApp.objects.get(provider='google', sites=settings.SITE_ID)
            google_client_id = google_app.client_id
            google_client_secret = google_app.secret
            if not google_client_id or not google_client_secret:
                 raise SocialApp.DoesNotExist("Client ID or Secret Key is empty in SocialApp config")
        except SocialApp.DoesNotExist:
            print("ERROR: Google SocialApp not configured correctly (Client ID/Secret missing) in Django Admin.")
            return Response({"error": "Google API credentials not configured on server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # --- Exchange Authorization Code for Tokens ---
        # When using @react-oauth/google with auth-code flow, the redirect URI is 'postmessage'
        # This MUST match one of the Authorized redirect URIs in Google Cloud Console
        # Add 'postmessage' to your Google Cloud Console authorized redirect URIs
        redirect_uri = 'postmessage'

        flow = Flow.from_client_config(
            client_config={
                "web": {
                    "client_id": google_client_id,
                    "client_secret": google_client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [redirect_uri, "http://localhost:5173", "http://127.0.0.1:5173"],
                    "javascript_origins": ["http://localhost:5173", "http://127.0.0.1:5173"]
                }
            },
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
            redirect_uri=redirect_uri
        )

        # Exchange the code
        # Handle scope validation issues by using OAuth2Session directly if Flow fails
        try:
            flow.fetch_token(code=auth_code)
            creds = flow.credentials
        except Exception as oauth_error:
            error_str = str(oauth_error)
            # If scope mismatch, use OAuth2Session directly to bypass strict scope validation
            if 'Scope has changed' in error_str or ('scope' in error_str.lower() and 'changed' in error_str.lower()):
                print(f"Scope validation error detected, using direct OAuth2Session: {error_str}")
                # Use OAuth2Session directly to exchange the code without strict scope validation
                oauth = OAuth2Session(
                    client_id=google_client_id,
                    redirect_uri=redirect_uri,
                    scope=['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
                )
                token_response = oauth.fetch_token(
                    'https://oauth2.googleapis.com/token',
                    code=auth_code,
                    client_secret=google_client_secret,
                    include_client_id=True
                )
                # Create credentials object from token response
                from google.oauth2.credentials import Credentials
                creds = Credentials(
                    token=token_response.get('access_token'),
                    refresh_token=token_response.get('refresh_token'),
                    id_token=token_response.get('id_token'),
                    token_uri='https://oauth2.googleapis.com/token',
                    client_id=google_client_id,
                    client_secret=google_client_secret
                )
            else:
                # Re-raise if it's not a scope-related error
                raise

        # --- Get User Info from ID Token ---
        # Verify and decode the ID token
        try:
            idinfo = id_token.verify_oauth2_token(
                creds.id_token,
                google_requests.Request(),
                google_client_id
            )
        except ValueError as e:
            print(f"Error verifying ID token: {e}")
            return Response({"error": "Invalid ID token from Google."}, status=status.HTTP_400_BAD_REQUEST)

        if not idinfo or 'email' not in idinfo:
             return Response({"error": "Email not found in Google ID token after exchange."}, status=status.HTTP_400_BAD_REQUEST)

        email = idinfo['email']
        google_user_id = idinfo['sub']

        # --- Find or Create User & Social Account ---
        try:
            social_account = SocialAccount.objects.get(provider='google', uid=google_user_id)
            user = social_account.user
            if not user.is_active: return Response({"error": "Account is inactive."}, status=status.HTTP_403_FORBIDDEN)
            print(f"DEBUG: Found existing Google user: {user.username}")
        except SocialAccount.DoesNotExist:
            try:
                user = CustomerUser.objects.get(email__iexact=email)
                if not user.is_active: return Response({"error": "Account linked to this email is inactive."}, status=status.HTTP_403_FORBIDDEN)
                SocialAccount.objects.create( user=user, provider='google', uid=google_user_id, extra_data=idinfo )
                print(f"DEBUG: Linked existing user {user.username} to Google ID {google_user_id}")
            except CustomerUser.DoesNotExist:
                username = email.split('@')[0]
                counter = 1
                base_username = username
                while CustomerUser.objects.filter(username=username).exists(): username = f"{base_username}_{counter}"; counter += 1
                user = CustomerUser.objects.create_user( username=username, email=email, first_name=idinfo.get('given_name', ''), last_name=idinfo.get('family_name', ''), is_active=True )
                user.set_unusable_password(); user.save()
                SocialAccount.objects.create( user=user, provider='google', uid=google_user_id, extra_data=idinfo )
                print(f"DEBUG: Created new user {user.username} from Google login")

        # --- Generate JWT Tokens ---
        tokens = get_tokens_for_user(user)

        return Response({
            "message": "Google login successful!",
            "access": tokens['access'],
            "refresh": tokens['refresh'],
            "user": {"username": user.username, "email": user.email, "first_name": user.first_name, "last_name": user.last_name}
        }, status=status.HTTP_200_OK)

    except GoogleAuthError as e:
        print(f"Error exchanging Google auth code: {e}")
        return Response({"error": f"Failed to verify with Google: {e}"}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        print(f"Unexpected error during Google login process: {e}")
        traceback.print_exc()
        return Response({"error": "An internal error occurred during Google login."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)