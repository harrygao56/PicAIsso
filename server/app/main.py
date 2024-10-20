from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from . import models, schemas, database
from .database import engine
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from .cloud_storage import upload_image_file_to_gcs
import uuid
from .services.openai_client import OpenAIClient

models.Base.metadata.create_all(bind=engine)
openai_client = OpenAIClient()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.post("/users", response_model=schemas.User)
async def create_user(
    username: str = Form(...),
    password: str = Form(...),
    profile_picture: UploadFile = File(None),
    db: Session = Depends(database.get_db)
):
    try:
        db_user = db.query(models.User).filter(models.User.username == username).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        
        profile_picture_url = None
        if profile_picture:
            # Generate a unique filename
            file_extension = profile_picture.filename.split(".")[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            
            # Read the file content
            file_content = await profile_picture.read()
            
            # Upload the file to GCS
            profile_picture_url = upload_image_file_to_gcs(file_content, unique_filename)
        
        hashed_password = get_password_hash(password)
        db_user = models.User(username=username, hashed_password=hashed_password, profile_picture_url=profile_picture_url)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        print(f"Error creating user: {str(e)}")  # This will print to your console
        db.rollback()  # Rollback the transaction in case of error
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/messages", response_model=schemas.Message)
async def create_message(
    message: schemas.MessageCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    recipient = db.query(models.User).filter(models.User.username == message.recipient_username).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    db_message = models.Message(
        content=message.content,
        sender_id=current_user.id,
        recipient_id=recipient.id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/messages", response_model=List[schemas.Message])
async def get_messages(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    messages = db.query(models.Message).filter(
        (models.Message.sender_id == current_user.id) | (models.Message.recipient_id == current_user.id)
    ).order_by(models.Message.timestamp.desc()).all()
    return messages

# @app.get("/users", response_model=schemas.User)
# async def get_current_user(current_user: models.User = Depends(get_current_user)):
#     return {
#         "id": current_user.id,
#         "username": current_user.username,
#         "profile_picture_url": current_user.profile_picture_url
#     }

@app.get("/users/{username}", response_model=schemas.User)
async def get_user_by_username(
    username: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "username": user.username,
        "profile_picture_url": user.profile_picture_url
    }

@app.post("/classify")
async def classify_message(
    request: schemas.MessageClassifyRequest,  # Assuming you have a schema for this
):
    # Extract the message from the request
    # message = request.message
    
    # # Use the OpenAI client to classify the message
    # classification_result = openai_client.classify_text(message)
    # print(classification_result)
    return {"classification": "illustration"}

@app.post("/getImage")
async def get_image(
    request: schemas.MessageGetImageRequest,
):
    return {"image_url": "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg"}