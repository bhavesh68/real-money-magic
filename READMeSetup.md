# 🛠️ Real Money Magic - Backend Setup Guide (FastAPI + Strawberry GraphQL)

This guide ensures all team members can run the **FastAPI server** locally after pulling from GitHub, using **Strawberry GraphQL** as the backend API.

---

## ✅ After Cloning or Pulling the Repository

```bash
git pull origin <branch-name>  # or git clone <repo-url>
cd server
```

> ⚠️ **IMPORTANT:** If you pulled the architecture before the switch to Strawberry, you must:
> - ❌ Delete `ariadne` and `graphql-core` from `requirements.txt` and `install.txt`
> - 🗑️ Remove the old `schema.py` file using `ariadne`
> - ✅ Confirm only **Strawberry** is being used in `main.py`

This ensures compatibility and prevents route conflicts or broken GraphQL schema references.

---

## ✅ Step 1: Create a Virtual Environment

```bash
python -m venv venv
```

This creates a `venv/` folder (intentionally ignored by `.gitignore` so it stays local).

---

## ✅ Step 2: Activate the Virtual Environment

### 🔹 On Windows:

```bash
venv\Scripts\activate
```

### 🔹 On macOS/Linux:

```bash
source venv/bin/activate
```

> You'll know it's active when you see `(venv)` in your terminal prompt.

---

## ✅ Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

This installs FastAPI, Uvicorn, MongoDB client, JWT, and Strawberry GraphQL libraries.

---

## ✅ Step 4: Run the Server

### If you're in the `/server` folder:

```bash
uvicorn app.main:app --reload
```

### If you're in the **project root** (`real-money-magic/`):

```bash
uvicorn app.main:app --reload --app-dir server
```

---

## ✅ Step 5: Add `.env` File (If Needed)

If the app needs environment variables:

Create a `.env` file inside the `server/` folder:

```env
MONGO_URL=your_mongodb_uri_here
JWT_SECRET=your_secret_here
```

> Ask your team lead if unsure what values to use.

---

## ✅ Step 6: VS Code IntelliSense Setup (Optional but Recommended)

To make VS Code properly resolve backend imports and Tailwind classes:

1. In the **root folder** of the project (not inside `client/` or `server/`), create:

```bash
.vscode/settings.json
```

2. Add this content:

```json
{
  "python.analysis.extraPaths": ["./server"],
  "css.validate": false,
  "tailwindCSS.includeLanguages": {
    "plaintext": "html",
    "typescript": "javascript"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

This ensures autocomplete and linting behave properly across both frontend and backend code.

---

## ✅ Step 7: Running Backend Tests with `pytest`

To verify that your backend GraphQL and utility functions work correctly:

### 🔹 Run all backend tests:
```bash
pytest
```

### 🔹 What it does:
- Automatically discovers files like `tests/test_*.py`
- Runs each `test_...()` function
- Reports ✅ passes and ❌ failures

### 🔹 Example test result:
```bash
tests/test_main.py ..F
```

### ✅ Tip:
- Test your GraphQL queries (e.g., `{ hello }`) and auth logic.
- Update test files if backend behavior changes.

---

## ❗ Common Issues & Fixes

| Problem                                      | Fix                                                 |
| -------------------------------------------- | --------------------------------------------------- |
| `ModuleNotFoundError: No module named 'app'` | Run with `--app-dir server` if using root directory |
| `venv` not found                             | You must create it using `python -m venv venv`      |
| `uvicorn` not found                          | Run `pip install -r requirements.txt` inside `venv` |
| Mongo connection fails                       | Check that `.env` has a valid `MONGO_URL`           |

---

## 🧠 Bonus: One-Command Server Start

In your root `package.json`, you can add:

```json
"scripts": {
  "start-server": "uvicorn app.main:app --reload --app-dir server"
}
```

Then run:

```bash
npm run start-server
```

---

Now your backend server (Strawberry GraphQL) is running at:\
[**http://localhost:8000/graphql**](http://localhost:8000/graphql) 🚀

You can send GraphQL queries like:

```graphql
query {
  hello
}
```

Make sure to test endpoints and connect your frontend properly!

---

For help, contact Alex or check the `README.md` project root. 💬

