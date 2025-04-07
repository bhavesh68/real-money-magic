from beanie import Document, PydanticObjectId
from pydantic import EmailStr, Field
from typing import List


class User(Document):
    first_name: str
    last_name: str
    email: EmailStr = Field(index=True, unique=True)
    hashed_password: str
    projects: List[PydanticObjectId] = []

    class Settings:
        name = "users"
