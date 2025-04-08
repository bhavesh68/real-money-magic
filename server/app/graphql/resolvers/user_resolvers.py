from fastapi import Request
from fastapi_jwt_auth import AuthJWT
from strawberry.types import Info
import strawberry
from app.models.user import User
import bcrypt

@strawberry.type
class UserType:
    id: strawberry.ID
    email: str
    first_name: str
    last_name: str

@strawberry.type
class PasswordChangeResponse:
    success: bool
    message: str

@strawberry.type
class UserQuery:
    @strawberry.field
    async def me(self, info: Info) -> UserType:
        request: Request = info.context["request"]
        auth = AuthJWT(request)
        auth.jwt_required()

        current_user_email = auth.get_jwt_subject()
        user = await User.find_one(User.email == current_user_email)
        if not user:
            raise Exception("User not found")

        return UserType(
            id=str(user.id),
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name
        )

@strawberry.type
class UserMutation:
    @strawberry.mutation
    async def update_user_profile(
        self,
        info: Info,
        first_name: str,
        last_name: str,
        email: str,
    ) -> UserType:
        request: Request = info.context["request"]
        auth = AuthJWT(request)
        auth.jwt_required()

        current_user_email = auth.get_jwt_subject()
        user = await User.find_one(User.email == current_user_email)
        if not user:
            raise Exception("User not found")

        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        await user.save()

        return UserType(
            id=str(user.id),
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
        )

    @strawberry.mutation
    async def change_password(
        self,
        info: Info,
        current_password: str,
        new_password: str,
    ) -> PasswordChangeResponse:
        request: Request = info.context["request"]
        auth = AuthJWT(request)
        auth.jwt_required()

        current_user_email = auth.get_jwt_subject()
        user = await User.find_one(User.email == current_user_email)
        if not user:
            return PasswordChangeResponse(success=False, message="User not found")

        if not bcrypt.checkpw(current_password.encode('utf-8'), user.hashed_password.encode('utf-8')):
            return PasswordChangeResponse(success=False, message="Incorrect current password")

        hashed_new_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        user.hashed_password = hashed_new_pw.decode('utf-8')
        await user.save()

        return PasswordChangeResponse(success=True, message="Password updated successfully")

