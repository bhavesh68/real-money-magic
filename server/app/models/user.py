from beanie import Document, Indexed
from pydantic import EmailStr, Field

class User(Document):
    first_name: str
    last_name: str
    email: EmailStr = Field(index=True, unique=True)
    hashed_password: str

    class Settings:
        name = "users"
