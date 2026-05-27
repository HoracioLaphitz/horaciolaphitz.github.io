import re
from pathlib import Path

from django.core.cache import cache

# Path to the repo root: backend/portfolio/services/notebook_service.py -> repo root
_REPO_ROOT = Path(__file__).resolve().parents[4]

_NOTEBOOKS_CACHE_KEY = "portfolio:notebooks"
_NOTEBOOKS_CACHE_TTL = 300  # 5 minutes


def _find_public_dir() -> Path:
    return _REPO_ROOT / "public"


def _extract_title_description(readme: str) -> tuple[str, str]:
    lines = readme.strip().split("\n")
    title = lines[0].replace("# ", "") if lines else "Untitled"
    description = lines[1] if len(lines) > 1 else ""
    return title, description


def _scan_notebooks() -> list[dict]:
    """Scan the filesystem and build the notebooks list (uncached)."""
    base = _find_public_dir() / "Proyectos"
    if not base.is_dir():
        return []

    projects: list[dict] = []
    html_dir = _find_public_dir() / "notebooks-html"
    has_html_dir = html_dir.is_dir()

    for item in sorted(base.iterdir()):
        if not item.is_dir():
            continue

        data: dict = {
            "slug": item.name.lower().replace(" ", "-"),
            "title": item.name.replace("_", " ").replace("-", " "),
            "description": "",
            "has_notebook": False,
            "notebook_url": None,
            "html_url": None,
            "assets": [],
        }

        # README
        readme = item / "README.md"
        if readme.is_file():
            try:
                title, desc = _extract_title_description(readme.read_text(encoding="utf-8"))
                data["title"] = title
                data["description"] = desc
            except Exception:
                pass

        # Notebook file
        notebook = item / "notebook.ipynb"
        if notebook.is_file():
            data["has_notebook"] = True
            data["notebook_url"] = f"/Proyectos/{item.name}/notebook.ipynb"

        # HTML rendering
        if has_html_dir:
            clean_name = re.sub(r"[^a-zA-Z0-9]", "", item.name.lower())
            for html_file in html_dir.iterdir():
                if html_file.suffix != ".html":
                    continue
                clean_html = re.sub(
                    r"[^a-zA-Z0-9]",
                    "",
                    html_file.stem.lower().replace("-", "").replace("_", ""),
                )
                if clean_name in clean_html or clean_html in clean_name:
                    data["html_url"] = f"/notebooks-html/{html_file.name}"
                    break

        # Asset directories
        for subdir in ("assets", "imagenes", "datos"):
            subdir_path = item / subdir
            if subdir_path.is_dir():
                for f in sorted(subdir_path.iterdir()):
                    if f.is_file():
                        data["assets"].append({
                            "name": f.name,
                            "url": f"/Proyectos/{item.name}/{subdir}/{f.name}",
                        })

        projects.append(data)

    return projects


def get_all_notebooks(force_refresh: bool = False) -> list[dict]:
    """Return all notebooks, using cache to avoid filesystem I/O on every call.

    Results are cached for ``_NOTEBOOKS_CACHE_TTL`` seconds (default 300).
    Pass ``force_refresh=True`` to bypass cache and re-scan the filesystem.
    """
    if force_refresh:
        cache.delete(_NOTEBOOKS_CACHE_KEY)

    projects = cache.get(_NOTEBOOKS_CACHE_KEY)
    if projects is None:
        projects = _scan_notebooks()
        cache.set(_NOTEBOOKS_CACHE_KEY, projects, _NOTEBOOKS_CACHE_TTL)

    return projects


def get_notebook_by_slug(slug: str) -> dict | None:
    """Return a single notebook by slug, using the cached listing."""
    for p in get_all_notebooks():
        if p["slug"] == slug:
            return p
    return None
