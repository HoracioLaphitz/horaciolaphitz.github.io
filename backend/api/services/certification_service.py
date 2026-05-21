from api.core.database import supabase
from api.core.cache import cache
from api.schemas.certification import CertificationSchema


class CertificationService:
    @staticmethod
    @cache(ttl_seconds=300)
    def get_all_certifications() -> list[CertificationSchema]:
        try:
            response = supabase.table("certifications").select("*").order(
                "issue_date", desc=True
            ).execute()

            return [CertificationSchema(**cert) for cert in response.data]
        except Exception:
            return []
