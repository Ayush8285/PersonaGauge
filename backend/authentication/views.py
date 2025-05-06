import jwt
import datetime
import bcrypt
from django.conf import settings
from pymongo import MongoClient
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, LoginSerializer
from db_connection import db
from django.contrib.auth.models import AnonymousUser
from bson import ObjectId


users_collection = db["users"]

# Function to generate JWT token manually
def generate_jwt_token(user):
    payload = {
        "email": user["email"],
        "name": user["name"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),  # Token expires in 1 day
        "iat": datetime.datetime.utcnow(),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]
            name = serializer.validated_data["name"]

            # Check if user already exists
            if users_collection.find_one({"email": email}):
                return Response({"error": "User already exists"}, status=400)

            # Hash password
            hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

            # Insert user into MongoDB
            new_user = {
                "email": email,
                "password": hashed_password,
                "name": name
            }
            result = users_collection.insert_one(new_user)
            user_id = str(result.inserted_id)  # Convert ObjectId to string

            # Generate JWT tokens with `user_id`
            payload = {
                "id": user_id,  # Store user_id in token
                "email": email,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
                "iat": datetime.datetime.utcnow(),
            }
            access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

            # refresh_payload = {
            #     "id": user_id,  # Store user_id in refresh token
            #     "email": email,
            #     "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
            #     "iat": datetime.datetime.utcnow(),
            # }
            # refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm="HS256")

            return Response(
                {
                    "message": "User registered successfully",
                    "user": {"id": user_id, "email": email, "name": name},  # Include user_id
                    "access": access_token,
                    # "refresh": refresh_token,
                },
                status=201,
            )

        return Response(serializer.errors, status=400)




class UserObject:
    """Simulate a Django user object with an `id` field."""
    def __init__(self, user_id):
        self.id = user_id


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            user = users_collection.find_one({"email": email})
            if not user:
                return Response({"error": "Invalid credentials"}, status=400)

            stored_password = user["password"]
            if isinstance(stored_password, str):
                stored_password = stored_password.encode('utf-8')

            if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
                return Response({"error": "Invalid credentials"}, status=400)

            # Convert ObjectId to string
            user_id = str(user["_id"])

            # Simulate Django user object
            user_instance = UserObject(user_id)

            # Generate JWT tokens with `user_id`
            refresh = RefreshToken.for_user(user_instance)
            access_token = str(refresh.access_token)

            return Response({
                "message": "Login successful",
                "user": {
                    "id": user_id,  # Include user_id
                    "email": email,
                    "name": user["name"]
                },
                "access": access_token,
                # "refresh": str(refresh),
            })
        return Response(serializer.errors, status=400)




class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({"message": "Logged out successfully"}, status=200)
