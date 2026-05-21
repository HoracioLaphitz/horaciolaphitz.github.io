from typing import Optional
from api.core.database import supabase
from api.core.cache import cache
from api.schemas.technology import TechnologySchema


class TechnologyService:
    @staticmethod
    @cache(ttl_seconds=300)
    def get_all_technologies() -> list[TechnologySchema]:
        try:
            response = supabase.table("technologies").select(
                "*,project_technologies(count)"
            ).execute()

            technologies = []
            for tech in response.data:
                tech_data = {**tech}
                project_count = len(tech.get("project_technologies", []))
                tech_data["project_count"] = project_count
                tech_data.pop("project_technologies", None)
                technologies.append(TechnologySchema(**tech_data))

            return technologies
        except Exception:
            return []

    @staticmethod
    @cache(ttl_seconds=300)
    def get_technology_by_slug(slug: str) -> Optional[TechnologySchema]:
        try:
            response = supabase.table("technologies").select(
                "*,project_technologies(count)"
            ).eq("slug", slug).execute()

            if not response.data:
                return None

            tech_data = response.data[0]
            project_count = len(tech_data.get("project_technologies", []))
            tech_data["project_count"] = project_count
            tech_data.pop("project_technologies", None)

            return TechnologySchema(**tech_data)
        except Exception:
            return None
