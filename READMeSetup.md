# 🛠️ Real Money Magic - Fullstack Setup Guide (FastAPI + React + GraphQL)

This guide ensures all team members can run both the **FastAPI backend** and **React frontend** locally. Includes `.env` instructions and optional editor setup for a smooth experience.

---

## ✅ After Cloning or Pulling the Repository

```bash
git pull origin <branch-name>  # or git clone <repo-url>
cd server  # Start with backend setup
```

> ⚠️ **IMPORTANT:** If you pulled the architecture before the switch to Strawberry:
> - ❌ Delete `ariadne` and `graphql-core` from `requirements.txt`
> - 🗑️ Remove old `schema.py`
> - ✅ Confirm `main.py` only uses **Strawberry**

---

## ✅ Step 1: Create a Virtual Environment

```bash
python -m venv venv
```

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

---

## ✅ Step 4: Add .env File for Secrets

Create a `.env` file inside the `server/` folder:

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/realmoneydb
JWT_SECRET=<your_generated_secret>
```

### ✨ Generating a JWT Secret:
```bash
# Optional secure key generation
openssl rand -hex 32
```

> Ask your team lead for the proper DB URI if needed.

---

## ✅ Step 5: Run the Backend Server

### If you're in the `/server` folder:
```bash
uvicorn app.main:app --reload
```

### If you're in the **project root** (`real-money-magic/`):
```bash
uvicorn app.main:app --reload --app-dir server
```

---

## ✅ Step 6: Optional VS Code IntelliSense Setup

Inside `.vscode/settings.json` at the **project root**:

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

---

## ✅ Step 7: Run Backend Tests with `pytest`

```bash
pytest
```

> Discovers and runs all test files named `test_*.py`

---

## ❗ Common Issues & Fixes

| Problem                                      | Fix                                                 |
| -------------------------------------------- | --------------------------------------------------- |
| `ModuleNotFoundError: No module named 'app'` | Run with `--app-dir server` if using root directory |
| `venv` not found                             | Create it with `python -m venv venv`                |
| `uvicorn` not found                          | Run `pip install -r requirements.txt` in `venv`     |
| Mongo connection fails                       | Check `.env` MONGO_URL                              |

---

## 🧠 Bonus: One-Command Server Start

Add this to root `package.json`:

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

# 🌐 Frontend Setup (Vite + React + Tailwind CSS)

From the **project root**:

```bash
cd client
npm install
```

### Run the development server:
```bash
npm run dev
```

> Starts at [http://localhost:5173](http://localhost:5173) by default

---

## ✅ Frontend `.env` File (Optional)

Inside `client/`, create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/graphql
```

> This allows Apollo or fetch clients to call your local backend

---

Now your app is fully running with:
- ✨ FastAPI backend at [http://localhost:8000/graphql](http://localhost:8000/graphql)
- 🌐 React frontend at [http://localhost:5173](http://localhost:5173)

You're ready to build, test, and push changes confidently!

For help, contact Alex or check the main README.md. 💬

