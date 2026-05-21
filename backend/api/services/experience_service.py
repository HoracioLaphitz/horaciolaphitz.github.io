from api.core.database import supabase
from api.core.cache import cache
from api.schemas.experience import ExperienceSchema


class ExperienceService:
    @staticmethod
    @cache(ttl_seconds=300)
    def get_all_experience() -> list[ExperienceSchema]:
        try:
            response = supabase.table("experience").select("*").order(
                "start_date", desc=True
            ).execute()

            return [ExperienceSchema(**exp) for exp in response.data]
        except Exception:
            return []
