from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry

# Testing Query Type
@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Hello from the backend!"

schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema)

app = FastAPI()

# Allowing frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attaching the GraphQL route
app.include_router(graphql_app, prefix="/graphql")
