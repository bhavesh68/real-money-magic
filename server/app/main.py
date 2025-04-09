from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Load env vars
load_dotenv()

# Importing app modules
from app.models.user import User
from fastapi_jwt_auth import AuthJWT
from app.auth import jwt  # Ensuring JWT config is loaded

# ⬇️ Importing modular resolvers
from app.graphql.resolvers.auth_resolvers import AuthQuery, AuthMutation
from app.graphql.resolvers.user_resolvers import UserQuery, UserMutation
from app.graphql.resolvers.project_resolvers import ProjectQuery, ProjectMutation
from app.models.project import Project

# ✅ Defining lifespan BEFORE initializing FastAPI
@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
    await init_beanie(database=client.get_default_database(), document_models=[User, Project])
    yield

# ✅ Now initialize the app with lifespan
app = FastAPI(lifespan=lifespan)

# Combine imported queries and mutations
@strawberry.type
class Query(UserQuery, ProjectQuery, AuthQuery):
    @strawberry.field
    def hello(self) -> str:
        return "Hello from the backend! FastAPI + GraphQL!"

@strawberry.type
class Mutation(UserMutation, ProjectMutation, AuthMutation):
    pass

# Use AuthMutation directly
schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

# Optional REST route
@app.get("/hello")
def hello_route():
    return {"message": "This is a REST route just for testing."}

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes.quotes import router as quote_router
from app.routes.project_routes import router as project_router

app.include_router(quote_router, prefix="/api")
app.include_router(project_router, prefix="/api")


