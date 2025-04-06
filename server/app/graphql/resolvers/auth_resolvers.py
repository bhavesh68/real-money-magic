from fastapi import Request
from fastapi_jwt_auth import AuthJWT
import strawberry
from strawberry.types import Info
from app.models.user import User
from app.auth.utils import hash_password, verify_password

@strawberry.type
class AuthQuery:
    @strawberry.field
    def protected_data(self, info: Info) -> str:
        request: Request = info.context["request"]
        auth = AuthJWT(request)
        auth.jwt_required()
        return "This is protected info only for authenticated users"

@strawberry.type
class AuthResponse:
    access_token: str
    refresh_token: str

@strawberry.type
class AuthMutation:
    @strawberry.field
    async def register(
        self, email: str, password: str, name: str
    ) -> bool:
        existing = await User.find_one({"email": email})
        if existing:
            return False
        
        name_parts = name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        user = User(
            email=email,
            hashed_password=hash_password(password),
            first_name=first_name,
            last_name=last_name
        )
        await user.insert()
        return True

    @strawberry.field
    async def login(self, email: str, password: str) -> AuthResponse:
        user = await User.find_one({"email": email})
        if not user or not verify_password(password, user.hashed_password):
            raise Exception("Invalid credentials")
        
        auth = AuthJWT()
        access_token = auth.create_access_token(subject=email)
        refresh_token = auth.create_refresh_token(subject=email)

        return AuthResponse(
            access_token=access_token, 
            refresh_token=refresh_token
        )
    
    @strawberry.field
    def refresh(self, info: Info) -> AuthResponse:
        request: Request = info.context["request"]
        auth = AuthJWT(request)
        auth.jwt_refresh_token_required()

        current_user = auth.get_jwt_subject()
        new_access_token = auth.create_access_token(subject=current_user)
        new_refresh_token = auth.create_refresh_token(subject=current_user)

        return AuthResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token
        )


