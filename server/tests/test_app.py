from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user import User
from app.graphql.resolvers.auth_resolvers import AuthQuery, AuthMutation
import strawberry

@strawberry.type
class Query(AuthQuery):
    @strawberry.field
    def hello(self) -> str:
        return "Hello from test app!"

schema = strawberry.Schema(query=Query, mutation=AuthMutation)
graphql_app = GraphQLRouter(schema)

async def create_test_app():
    app = FastAPI()
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    await init_beanie(database=client.test_db, document_models=[User])
    app.include_router(graphql_app, prefix="/graphql")
    return app
