import logging

logger = logging.getLogger(__name__)


def handle_contact_message(name, email, message):
    try:
        logger.info(f"Contact message from {email}: {name}")
        return {
            "success": True,
            "message": "Tu mensaje ha sido recibido. Te contactaremos pronto.",
        }
    except Exception as e:
        logger.error(f"Error processing contact message: {e}")
        return {
            "success": False,
            "message": "Error al procesar tu mensaje. Intenta más tarde.",
        }
