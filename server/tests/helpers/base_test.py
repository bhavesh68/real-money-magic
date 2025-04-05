import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from tests.test_app import create_test_app

GRAPHQL_ENDPOINT = "/graphql"

@pytest_asyncio.fixture
async def async_client():
    app = await create_test_app()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
