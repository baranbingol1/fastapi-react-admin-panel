from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
import secrets
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

fake_user_db = {
    "admin": {
        "username": "admin",
        "password": "admin"
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    logger.info(f"Login attempt for user: {form_data.username}")
    
    user = fake_user_db.get(form_data.username)
    if not user:
        logger.warning(f"User not found: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    if user["password"] != form_data.password:
        logger.warning(f"Invalid password for user: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    token = secrets.token_hex(16)
    logger.info(f"Successful login for user: {form_data.username}")
    return {"access_token": token, "token_type": "bearer"}