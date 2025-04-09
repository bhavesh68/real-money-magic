from typing import Optional, List, Dict
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from beanie import PydanticObjectId, Document

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
    stress_data: Dict[str, str] = Field(default_factory=dict)
    notes: Optional[str] = None
    owner_id: Optional[PydanticObjectId] = None

    class Settings:
        name = "projects"
