from fastapi import APIRouter, status
from api.schemas.contact import ContactMessageSchema, ContactResponseSchema
from api.services.contact_service import ContactService

router = APIRouter()


@router.post(
    "",
    response_model=ContactResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Send contact message",
    description="Receive and process a contact form submission",
)
async def send_contact_message(contact_data: ContactMessageSchema) -> ContactResponseSchema:
    """
    Send a contact message.

    - **name**: Sender's full name (2-100 characters)
    - **email**: Sender's email address (valid email format)
    - **message**: Contact message (10-5000 characters)

    Returns:
        ContactResponseSchema with success status and message
    """
    result = await ContactService.handle_contact_message(contact_data)
    return ContactResponseSchema(**result)
