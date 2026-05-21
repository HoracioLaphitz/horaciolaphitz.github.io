import os
import re


def _find_public_dir():
    return os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "..",
        "public",
    )


def _extract_title_description(readme):
    lines = readme.strip().split("\n")
    title = lines[0].replace("# ", "") if lines else "Untitled"
    description = lines[1] if len(lines) > 1 else ""
    return title, description


def get_all_notebooks():
    base = os.path.join(_find_public_dir(), "Proyectos")
    projects = []

    if not os.path.exists(base):
        return projects

    for item in os.listdir(base):
        item_path = os.path.join(base, item)
        if not os.path.isdir(item_path):
            continue

        data = {
            "slug": item.lower().replace(" ", "-"),
            "title": item.replace("_", " ").replace("-", " "),
            "description": "",
            "has_notebook": False,
            "notebook_url": None,
            "html_url": None,
            "assets": [],
        }

        readme_path = os.path.join(item_path, "README.md")
        if os.path.exists(readme_path):
            try:
                with open(readme_path, encoding="utf-8") as f:
                    title, desc = _extract_title_description(f.read())
                data["title"] = title
                data["description"] = desc
            except Exception:
                pass

        notebook_path = os.path.join(item_path, "notebook.ipynb")
        if os.path.exists(notebook_path):
            data["has_notebook"] = True
            data["notebook_url"] = f"/Proyectos/{item}/notebook.ipynb"

        html_dir = os.path.join(_find_public_dir(), "notebooks-html")
        if os.path.exists(html_dir):
            clean_name = re.sub(r"[^a-zA-Z0-9]", "", item.lower())
            for html_file in os.listdir(html_dir):
                if html_file.endswith(".html"):
                    clean_html = re.sub(r"[^a-zA-Z0-9]", "", html_file.lower().replace("-", "").replace("_", ""))
                    if clean_name in clean_html or clean_html in clean_name:
                        data["html_url"] = f"/notebooks-html/{html_file}"
                        break

        for subdir in ("assets", "imagenes", "datos"):
            subdir_path = os.path.join(item_path, subdir)
            if os.path.exists(subdir_path):
                for fname in os.listdir(subdir_path):
                    fpath = os.path.join(subdir_path, fname)
                    if os.path.isfile(fpath):
                        data["assets"].append({
                            "name": fname,
                            "url": f"/Proyectos/{item}/{subdir}/{fname}",
                        })

        projects.append(data)

    return projects


def get_notebook_by_slug(slug):
    for p in get_all_notebooks():
        if p["slug"] == slug:
            return p
    return None
