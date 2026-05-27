import logging

from ..models import ContactMessage

logger = logging.getLogger(__name__)


def handle_contact_message(name, email, message):
    try:
        ContactMessage.objects.create(name=name, email=email, message=message)
        logger.info(f"Contact message saved from {email}: {name}")
        return {
            "success": True,
            "message": "Mensaje recibido. Te respondo a la brevedad.",
        }
    except Exception as e:
        logger.error(f"Error processing contact message: {e}")
        return {
            "success": False,
            "message": "Error al enviar el mensaje. Intenta de nuevo más tarde.",
        }
