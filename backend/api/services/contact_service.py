import logging
from api.schemas.contact import ContactMessageSchema

logger = logging.getLogger(__name__)


class ContactService:
    """Service for handling contact form submissions."""

    @staticmethod
    async def handle_contact_message(contact_data: ContactMessageSchema) -> dict:
        """
        Process and store contact message.

        Args:
            contact_data: Contact form data

        Returns:
            Dictionary with success status and message
        """
        try:
            # TODO: Implement email sending or database storage
            # For now, just log the message
            logger.info(
                f"Contact message received from {contact_data.email}",
                extra={
                    "sender_name": contact_data.name,
                    "sender_email": contact_data.email,
                },
            )

            # In a production environment, you would:
            # 1. Save to database
            # 2. Send email notification
            # 3. Send confirmation email to sender

            return {
                "success": True,
                "message": "Tu mensaje ha sido recibido. Te contactaremos pronto.",
            }

        except Exception as e:
            logger.error(f"Error processing contact message: {str(e)}")
            return {
                "success": False,
                "message": "Error al procesar tu mensaje. Intenta más tarde.",
            }
