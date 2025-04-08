import strawberry
from typing import List
from strawberry.types import Info
from beanie import PydanticObjectId
from beanie.operators import In
from app.models.project import Project
from app.models.user import User
from app.auth.auth import get_current_user_gql 

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
class ProjectType:
    id: strawberry.ID
    title: str
    notes: str | None
    calendar_data: List[CalendarEntryType]
    budget_data: List[BudgetEntryType]
    created_at: str

@strawberry.type
class ProjectQuery:
    @strawberry.field
    async def my_projects(self, info: Info) -> List[ProjectType]:
        user: User = await get_current_user_gql(info)
        projects = await Project.find(In(Project.id, user.projects)).to_list()
        return [ProjectType(**p.dict()) for p in projects]

@strawberry.type
class ProjectMutation:
    @strawberry.mutation
    async def create_project(self, info: Info, title: str, notes: str = "") -> ProjectType:
        user: User = await get_current_user_gql(info)

        if len(user.projects) >= 3:
            raise Exception("You have reached the maximum of 3 projects.")

        project = Project(title=title, notes=notes)
        await project.insert()
        user.projects.append(project.id)
        await user.save()
        return ProjectType(**project.dict())

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

        project.budget_data = budget_data
        await project.save()
        return ProjectType(**project.dict())

