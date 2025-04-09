from fastapi import Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from strawberry.types import Info
from app.models.user import User

async def get_current_user(Authorize: AuthJWT = Depends()) -> User:
    try:
        Authorize.jwt_required()
        user_email = Authorize.get_jwt_subject()
        user = await User.find_one(User.email == user_email)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
async def get_current_user_gql(info: Info) -> User:
    try:
        request = info.context["request"]
        Authorize = AuthJWT(req=request)
        Authorize.jwt_required()
        user_email = Authorize.get_jwt_subject()
        user = await User.find_one(User.email == user_email)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

