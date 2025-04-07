import strawberry
from typing import List
from strawberry.types import Info
from beanie import PydanticObjectId
from app.models.project import Project
from app.models.user import User
from app.auth.auth import get_current_user_gql 

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
        projects = await Project.find(Project.id.in_(user.projects)).to_list()
        return [ProjectType(**p.dict()) for p in projects]

@strawberry.type
class ProjectMutation:
    @strawberry.mutation
    async def create_project(self, info: Info, title: str, notes: str = "") -> ProjectType:
        user: User = await get_current_user_gql(info)
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
