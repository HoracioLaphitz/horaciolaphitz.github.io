from api.core.database import supabase
from api.core.cache import cache
from api.schemas.education import EducationSchema


class EducationService:
    @staticmethod
    @cache(ttl_seconds=300)
    def get_all_education() -> list[EducationSchema]:
        try:
            response = supabase.table("education").select("*").order(
                "start_date", desc=True
            ).execute()

            return [EducationSchema(**edu) for edu in response.data]
        except Exception:
            return []
