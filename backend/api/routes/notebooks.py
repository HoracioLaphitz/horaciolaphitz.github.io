from fastapi import APIRouter, HTTPException
from typing import List, Optional
import os
import re
from api.core.cache import cache

router = APIRouter()

# Base path for the projects in the public directory
PROJECTS_BASE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
    'public',
    'Proyectos'
)

def extract_title_description(readme_content: str) -> tuple[str, str]:
    """Extract title and description from README content."""
    lines = readme_content.strip().split('\n')
    title = lines[0].replace('# ', '') if lines else "Untitled"
    description = lines[1] if len(lines) > 1 else ""
    return title, description

@cache(ttl_seconds=300)
def get_notebooks_projects() -> List[dict]:
    """Scan the projects directory and return a list of notebook projects."""
    projects = []
    if not os.path.exists(PROJECTS_BASE_PATH):
        return projects

    for item in os.listdir(PROJECTS_BASE_PATH):
        item_path = os.path.join(PROJECTS_BASE_PATH, item)
        if os.path.isdir(item_path):
            project_data = {
                "slug": item.lower().replace(' ', '-'),
                "title": item.replace('_', ' ').replace('-', ' '),
                "description": "",
                "has_notebook": False,
                "notebook_url": None,
                "html_url": None,
                "assets": []
            }

            readme_path = os.path.join(item_path, 'README.md')
            if os.path.exists(readme_path):
                try:
                    with open(readme_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    title, description = extract_title_description(content)
                    project_data["title"] = title
                    project_data["description"] = description
                except Exception:
                    pass

            notebook_path = os.path.join(item_path, 'notebook.ipynb')
            if os.path.exists(notebook_path):
                project_data["has_notebook"] = True
                project_data["notebook_url"] = f"/Proyectos/{item}/notebook.ipynb"

            html_dir = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
                'public',
                'notebooks-html'
            )
            if os.path.exists(html_dir):
                clean_project_name = re.sub(r'[^a-zA-Z0-9]', '', item.lower())
                for html_file in os.listdir(html_dir):
                    if html_file.endswith('.html'):
                        clean_html_name = re.sub(r'[^a-zA-Z0-9]', '', html_file.lower().replace('-', '').replace('_', ''))
                        if clean_project_name in clean_html_name or clean_html_name in clean_project_name:
                            project_data["html_url"] = f"/notebooks-html/{html_file}"
                            break

            for subdir in ['assets', 'imagenes', 'datos']:
                subdir_path = os.path.join(item_path, subdir)
                if os.path.exists(subdir_path):
                    for fname in os.listdir(subdir_path):
                        fpath = os.path.join(subdir_path, fname)
                        if os.path.isfile(fpath):
                            project_data["assets"].append({
                                "name": fname,
                                "url": f"/Proyectos/{item}/{subdir}/{fname}"
                            })

            projects.append(project_data)

    return projects

@router.get("", response_model=List[dict])
def get_notebooks():
    """Get all notebook projects."""
    return get_notebooks_projects()

@router.get("/{slug}", response_model=dict)
def get_notebook_by_slug(slug: str):
    """Get a specific notebook project by slug."""
    projects = get_notebooks_projects()
    for project in projects:
        if project["slug"] == slug:
            return project
    raise HTTPException(status_code=404, detail="Project not found")