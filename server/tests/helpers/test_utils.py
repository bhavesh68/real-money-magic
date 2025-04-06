import logging
from colorama import Fore

# Enhanced logging with color in console and file
def log_test(name: str, message: str, color: str = Fore.WHITE):
    print(color + message)
    logging.info(f"[{name}] {message}")

# Shared GraphQL queries
REGISTER_QUERY = """
mutation {
    register(email: "testcase@example.com", password: "test1234", name: "Test User")
}
"""

LOGIN_QUERY = """
mutation {
    login(email: "testcase@example.com", password: "test1234") {
        accessToken
        refreshToken
    }
}
"""

PROTECTED_LOGIN_QUERY = """
mutation {
    login(email: "testcase@example.com", password: "test1234") {
        accessToken
    }
}
"""

PROTECTED_QUERY = """
query {
    protectedData
}
"""

REFRESH_LOGIN_QUERY = """
mutation {
    login(email: "testcase@example.com", password: "test1234") {
        refreshToken
    }
}
"""

REFRESH_QUERY = """
mutation {
    refresh {
        accessToken
    }
}
"""

BAD_LOGIN_QUERY = """
mutation {
    login(email: "testcase@example.com", password: "wrongpassword") {
        accessToken
        refreshToken
    }
}
"""

EMPTY_CREDENTIALS_QUERY = """
mutation {
    login(email: "", password: "") {
        accessToken
        refreshToken
    }
}
"""

INVALID_EMAIL_QUERY = """
mutation {
    login(email: "notanemail", password: "test1234") {
        accessToken
        refreshToken
    }
}
"""
