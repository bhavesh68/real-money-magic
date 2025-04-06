import asyncio
import sys
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

import pytest
import logging
from colorama import Fore, Style, init
from tests.helpers.base_test import async_client
from tests.helpers.test_utils import (
    log_test,
    LOGIN_QUERY,
    REGISTER_QUERY,
    PROTECTED_LOGIN_QUERY,
    PROTECTED_QUERY,
    REFRESH_LOGIN_QUERY,
    REFRESH_QUERY,
    BAD_LOGIN_QUERY,
    EMPTY_CREDENTIALS_QUERY,
    INVALID_EMAIL_QUERY
)

init(autoreset=True)

# Configure logging
logging.basicConfig(
    filename='logs/test_results.log',
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    force=True
)

logging.info("\n" + "="*60 + "\n🧪 NEW TEST SESSION STARTED\n" + "="*60)

# Login and Register pytest
@pytest.mark.asyncio
async def test_register_user(async_client):
    response = await async_client.post("/graphql", json={"query": REGISTER_QUERY})
    assert response.status_code == 200
    response_json = response.json()
    
    log_test("test_register_user", f"🔵 Register Response: {response_json}", Fore.GREEN)

    result = response_json.get("data", {}).get("register")
    assert result is not None, "Register mutation returned no data"
    if result:
        log_test("test_register_user", "[✅ TEST] New user registered successfully.")
    else:
        log_test("test_register_user", "[ℹ️ TEST] User already exists — skipping registration.", Fore.YELLOW)

    assert result in [True, False]

@pytest.mark.asyncio
async def test_login_user(async_client):
    response = await async_client.post("/graphql", json={"query": LOGIN_QUERY})
    
    log_test("test_login_user", f"🟢 Login Response: {response.json()}", Fore.CYAN)

    assert response.status_code == 200
    tokens = response.json()["data"]["login"]
    assert "accessToken" in tokens
    assert "refreshToken" in tokens

# Invalid Credentials pytest
@pytest.mark.asyncio
async def test_invalid_login(async_client):
    # Step 1: Attempts login with wrong password
    bad_login_response = await async_client.post("/graphql", json={"query": BAD_LOGIN_QUERY})
    assert bad_login_response.status_code == 200
    response_json = bad_login_response.json()

    log_test("test_invalid_login", f"❌ Invalid Login Response: {response_json}", Fore.RED)

    # Step 2: Verifies that login failed — either data is None or error message is correct
    assert response_json["data"] is None
    assert "errors" in response_json
    assert response_json["errors"][0]["message"] == "Invalid credentials"

    log_test("test_invalid_login", "[✅ TEST] Invalid login correctly rejected.", Fore.GREEN)

# Empty Credentials pytest
@pytest.mark.asyncio
async def test_login_with_empty_credentials(async_client):
    response = await async_client.post("/graphql", json={"query": EMPTY_CREDENTIALS_QUERY})
    response_json = response.json()

    log_test("test_login_with_empty_credentials", f"❌ Empty Credentials Login Response: {response_json}", Fore.RED)

    assert "errors" in response_json
    assert "Invalid credentials" in response_json["errors"][0]["message"]

    log_test("test_login_with_empty_credentials", "[✅ TEST] Empty credentials correctly rejected.", Fore.GREEN)

# Invalid Email pytest
@pytest.mark.asyncio
async def test_login_with_invalid_email_format(async_client):
    response = await async_client.post("/graphql", json={"query": INVALID_EMAIL_QUERY})
    response_json = response.json()

    log_test("test_login_with_invalid_email_format", f"❌ Malformed Email Login Response: {response_json}", Fore.RED)

    assert "errors" in response_json
    assert "Invalid credentials" in response_json["errors"][0]["message"]
    
    log_test("test_login_with_invalid_email_format", "[✅ TEST] Malformed email correctly rejected.", Fore.GREEN)


# Protected Data pytest
@pytest.mark.asyncio
async def test_protected_data_with_token(async_client):
    login_response = await async_client.post("/graphql", json={"query": PROTECTED_LOGIN_QUERY})
    token = login_response.json()["data"]["login"]["accessToken"]

    # Step 2: Uses access token in protected query
    headers = {"Authorization": f"Bearer {token}"}
    response = await async_client.post("/graphql", json={"query": PROTECTED_QUERY}, headers=headers)

    log_test("test_protected_data_with_token", f"🛡️ Protected Query With Token Response: {response.json()}", Fore.CYAN)

    assert response.status_code == 200
    assert response.json()["data"]["protectedData"] == "This is protected info only for authenticated users"

@pytest.mark.asyncio
async def test_protected_data_without_token(async_client):
    response = await async_client.post("/graphql", json={"query": PROTECTED_QUERY})

    log_test("test_protected_data_without_token", f"🚫 Protected Query Without Token Response: {response.json()}", Fore.YELLOW)

    assert response.status_code == 200
    assert "errors" in response.json()
    assert response.json()["errors"][0]["message"] == "Missing Authorization Header"

# Refresh Token pytest
@pytest.mark.asyncio
async def test_refresh_token(async_client):
    # Step 1: Login to get refresh token
    login_response = await async_client.post("/graphql", json={"query": REFRESH_LOGIN_QUERY})
    assert login_response.status_code == 200
    login_data = login_response.json()

    log_test("test_refresh_token", f"🔐 Login Response (for refresh): {login_data}", Fore.BLUE)

    refresh_token = login_data["data"]["login"]["refreshToken"]
    headers = {"Authorization": f"Bearer {refresh_token}"}

    # Step 2: Uses refresh token to get new access token
    refresh_response = await async_client.post("/graphql", json={"query": REFRESH_QUERY}, headers=headers)
    assert refresh_response.status_code == 200
    refresh_data = refresh_response.json()

    log_test("test_refresh_token", f"♻️ Refresh Token Response: {refresh_data}", Fore.MAGENTA)

    # Step 3: Validates the new access token is received
    new_access_token = refresh_data["data"]["refresh"]["accessToken"]
    assert isinstance(new_access_token, str) and len(new_access_token) > 0

    log_test("test_refresh_token", "[✅ TEST] Successfully refreshed access token.", Fore.GREEN)




