from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str
    profile_picture_url: Optional[str] = None

class User(BaseModel):
    id: int
    username: str
    profile_picture_url: Optional[str] = None

    class Config:
        orm_mode = True

class MessageCreate(BaseModel):
    content: str
    image_url: Optional[str] = None
    recipient_username: str

class Message(BaseModel):
    id: int
    content: str
    image_url: Optional[str] = None
    timestamp: datetime
    sender: User
    recipient: User

    class Config:
        orm_mode = True

class MessageClassifyRequest(BaseModel):
    message: str

class MessageGetImageRequest(BaseModel):
    message: str
    classification: str