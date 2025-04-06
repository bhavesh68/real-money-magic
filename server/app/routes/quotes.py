import random
from fastapi import APIRouter
import requests

router = APIRouter()

# 🌟 Fallback quote pool
FALLBACK_QUOTES = [
    {"quote": "Abundance starts with gratitude. 💚", "author": "Real Money Magic"},
    {"quote": "You are the source of your own abundance. ✨", "author": "Real Money Magic"},
    {"quote": "Wealth flows where focus goes. 🌊", "author": "Real Money Magic"},
    {"quote": "Invest in yourself — it’s the best ROI. 📈", "author": "Real Money Magic"},
    {"quote": "Clarity brings prosperity. 🌿", "author": "Real Money Magic"},
    {"quote": "Small steps build big futures. 🚀", "author": "Real Money Magic"},
    {"quote": "Your mindset is your money magnet. 🧲", "author": "Real Money Magic"},
    {"quote": "Magic happens when you take aligned action. ✨", "author": "Real Money Magic"},
    {"quote": "Magic happens when positivity, faith, and determination meet opportunity ✨", "author": "Real Money Magic"},
]

last_index = -1 

@router.get("/quote")
def get_quote():
    global last_index
    try:
        res = requests.get("https://zenquotes.io/api/random")
        quote = res.json()[0]

        # If rate limit message shows up
        if "too many requests" in quote["q"].lower():
            raise Exception("Rate limit hit")

        return {"quote": quote["q"], "author": quote["a"]}
    except Exception as e:
        print("🛑 Using fallback quote due to error:", str(e)) 

        # Prevents same quote usage from the last
        index = random.randint(0, len(FALLBACK_QUOTES) - 1)
        while index == last_index and len(FALLBACK_QUOTES) > 1:
            index = random.randint(0, len(FALLBACK_QUOTES) - 1)

        last_index = index
        return FALLBACK_QUOTES[index]
