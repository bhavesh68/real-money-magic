import strawberry
from typing import List
from strawberry.types import Info
from beanie import PydanticObjectId
from beanie.operators import In
from fastapi import HTTPException
from app.models.project import Project, BudgetEntry
from app.models.user import User
from app.auth.auth import get_current_user_gql, get_current_user

# INPUT types for mutations
@strawberry.input
class BudgetEntryInput:
    category: str
    amount: float
    type: str
    recurring: bool
    note: str | None = None

@strawberry.input
class CalendarItemInput:
    category: str
    amount: float
    type: str
    recurring: bool
    note: str | None = None

@strawberry.input
class CalendarEntryInput:
    date: str
    entries: List[CalendarItemInput]

@strawberry.input
class StressDataInput:
    date: str
    emoji: str  # 😊, 🥺, 🤯

# OUTPUT types for queries
@strawberry.type
class BudgetEntryType:
    category: str
    amount: float
    type: str
    recurring: bool
    note: str | None

@strawberry.type
class CalendarEntryType:
    date: str
    entries: List[BudgetEntryType]

@strawberry.type
class StressDataType:
    date: str
    emoji: str

@strawberry.type
class ProjectType:
    id: strawberry.ID
    title: str
    notes: str | None
    calendar_data: List[CalendarEntryType]
    budget_data: List[BudgetEntryType]
    stress_data: List[StressDataType]
    created_at: str
    owner_id: strawberry.ID 

@strawberry.type
class ProjectQuery:
    @strawberry.field
    async def my_projects(self, info: Info) -> List[ProjectType]:
        user: User = await get_current_user_gql(info)
        projects = await Project.find(In(Project.id, user.projects)).to_list()
        return [ProjectType(**p.dict()) for p in projects]

    @strawberry.field
    async def get_project(self, info: Info, id: strawberry.ID) -> ProjectType:
        user = await get_current_user_gql(info) 
        project = await Project.get(id)

        if not project or project.owner_id != user.id:
            raise HTTPException(status_code=404, detail="Project not found")

        return to_project_type(project)


@strawberry.type
class ProjectMutation:
    @strawberry.mutation
    async def create_project(self, info: Info, title: str, notes: str = "") -> ProjectType:
        user: User = await get_current_user_gql(info)

        if len(user.projects) >= 3:
            raise Exception("You have reached the maximum of 3 projects.")

        project = Project(title=title, notes=notes, owner_id=user.id)

        print("🔍 project.owner_id =", project.owner_id)
        print("🔍 user.id =", user.id)

        await project.insert()
        user.projects.append(project.id)
        await user.save()
        return to_project_type(project)

    @strawberry.mutation
    async def delete_project(self, info: Info, project_id: strawberry.ID) -> str:
        user: User = await get_current_user_gql(info)
        project = await Project.get(PydanticObjectId(project_id))
        if not project or project.id not in user.projects:
            raise Exception("Project not found or not yours.")
        await project.delete()
        user.projects.remove(project.id)
        await user.save()
        return "Project deleted"
    
    @strawberry.mutation
    async def update_project(
        self,
        info: Info,
        project_id: strawberry.ID,
        title: str,
        notes: str = ""
    ) -> ProjectType:
        user: User = await get_current_user_gql(info)
        project = await Project.get(PydanticObjectId(project_id))

        if not project or project.id not in user.projects:
            raise Exception("Unauthorized or project not found")

        project.title = title
        project.notes = notes
        await project.save()
        
        return to_project_type(project)

    
    @strawberry.mutation
    async def update_calendar_data(
        self,
        info: Info,
        project_id: strawberry.ID,
        calendar_data: List[CalendarEntryInput]
    ) -> ProjectType:
        user: User = await get_current_user_gql(info)
        project = await Project.get(PydanticObjectId(project_id))

        if not project or project.id not in user.projects:
            raise Exception("Unauthorized or project not found")

        # Convert input to internal models
        from app.models.project import CalendarEntry, BudgetEntry

        project.calendar_data = [
            CalendarEntry(
                date=entry.date,
                entries=[
                    BudgetEntry(**item.__dict__) for item in entry.entries
                ]
            ) for entry in calendar_data
        ]

        await project.save()
        return to_project_type(project)

    
    @strawberry.mutation
    async def update_budget_data(
        self,
        info: Info,
        project_id: strawberry.ID,
        budget_data: List[BudgetEntryInput] 
    ) -> ProjectType:
        user: User = await get_current_user_gql(info)
        project = await Project.get(PydanticObjectId(project_id))

        if not project or project.id not in user.projects:
            raise Exception("Unauthorized or project not found")

        project.budget_data = [BudgetEntry(**entry.__dict__) for entry in budget_data]
        await project.save()
        
        return to_project_type(project)
    
    @strawberry.mutation
    async def update_stress_data(
        self,
        info: Info,
        project_id: strawberry.ID,
        stress_data: List[StressDataInput]
    ) -> ProjectType:
        user = await get_current_user_gql(info)
        project = await Project.get(PydanticObjectId(project_id))

        if not project or project.id not in user.projects:
            raise Exception("Unauthorized or project not found")

        # Merge or overwrite stress data
        if project.stress_data is None:
            project.stress_data = {}

        for item in stress_data:
            project.stress_data[item.date] = item.emoji

        await project.save()
        return to_project_type(project)



# Project Helper
def to_project_type(project: Project) -> ProjectType:
    return ProjectType(
        id=str(project.id),
        title=project.title,
        notes=project.notes,
        created_at=project.created_at.isoformat(),
        stress_data=[
            StressDataType(date=k, emoji=v)
            for k, v in (project.stress_data or {}).items()
        ],
        owner_id=str(project.owner_id),
        budget_data=[
            BudgetEntryType(
                category=b.category,
                amount=b.amount,
                type=b.type,
                recurring=b.recurring,
                note=b.note,
            )
            for b in project.budget_data
        ],
        calendar_data=[
            CalendarEntryType(
                date=entry.date,
                entries=[
                    BudgetEntryType(
                        category=e.category,
                        amount=e.amount,
                        type=e.type,
                        recurring=e.recurring,
                        note=e.note,
                    ) for e in entry.entries
                ],
            )
            for entry in project.calendar_data
        ],
    )


