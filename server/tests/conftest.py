import pytest_asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user import User
import os
from dotenv import load_dotenv

# 👇 Detecting if we're in test mode
if os.getenv("PYTEST_CURRENT_TEST"):
    load_dotenv(dotenv_path=".env.test")  # Load test-specific DB
else:
    load_dotenv()

@pytest_asyncio.fixture(autouse=True, scope="session")
async def initialize_beanie():
    client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
    await init_beanie(database=client.get_default_database(), document_models=[User])
