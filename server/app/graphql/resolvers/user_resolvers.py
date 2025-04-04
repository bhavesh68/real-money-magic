from fastapi import Request
from fastapi_jwt_auth import AuthJWT
from strawberry.types import Info
import strawberry
from app.models.user import User

@strawberry.type
class UserType:
    id: strawberry.ID
    email: str
    first_name: str
    last_name: str

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
