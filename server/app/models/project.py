from beanie import Document
from pydantic import Field
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel


class BudgetEntry(BaseModel):
    category: str
    amount: float
    type: str  
    recurring: bool = False
    note: Optional[str] = None

class CalendarEntry(BaseModel):
    date: str
    entries: List[BudgetEntry] 

class Project(Document):
    title: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    calendar_data: List[CalendarEntry] = []
    budget_data: List[BudgetEntry] = []
    notes: Optional[str] = None

    class Settings:
        name = "projects"
