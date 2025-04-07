from fastapi import APIRouter, Depends, HTTPException
from beanie import PydanticObjectId
from app.models.project import Project
from app.models.user import User
from app.auth.auth import get_current_user 
from typing import List

router = APIRouter()

@router.post("/projects", response_model=Project)
async def create_project(project: Project, user: User = Depends(get_current_user)):
    project.id = None  # Let Beanie auto-generate
    new_project = await project.insert()
    user.projects.append(new_project.id)
    await user.save()
    return new_project

@router.get("/projects", response_model=List[Project])
async def get_projects(user: User = Depends(get_current_user)):
    return await Project.find(Project.id.in_(user.projects)).to_list()

@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: PydanticObjectId, user: User = Depends(get_current_user)):
    project = await Project.get(project_id)
    if not project or project.id not in user.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/projects/{project_id}")
async def delete_project(project_id: PydanticObjectId, user: User = Depends(get_current_user)):
    project = await Project.get(project_id)
    if not project or project.id not in user.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    await project.delete()
    user.projects.remove(project_id)
    await user.save()
    return {"message": "Project deleted"}
