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
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json


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
    return {"access_token": access_token, "token_type": "bearer", "client_id": user.id}

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
        image_url=message.image_url,
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
    message = request.message
    classification = request.classification
    prompt = ""
    if classification == "illustration":
        prompt = openai_client.generate_prompt(message, classification)
        image_url = openai_client.generate_image(prompt)
    elif classification == "diagram":
        prompt = openai_client.generate_prompt(message, classification)
        image_url = openai_client.generate_diagram(prompt)
    return {"image_url": image_url}


#WebScoket support

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}  # Dict to map user ID to connections

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        self.active_connections[user_id].remove(websocket)
        if not self.active_connections[user_id]:  # Remove user from dict if no connections left
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, recipient_id: int):
        if recipient_id in self.active_connections:
            for connection in self.active_connections[recipient_id]:
                await connection.send_text(message)

manager = ConnectionManager()
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int, db: Session = Depends(database.get_db)):
    try:
        await manager.connect(websocket, client_id)
        print(f"Client {client_id} connected")
        while True:
            # Wait to receive data from the WebSocket client
            data = await websocket.receive_text()
            print(f"Received data from client {client_id}: {data}")
            message_data = json.loads(data)  # Assuming the message is sent as JSON

            # Validate and extract the fields
            content = message_data.get("content")
            image_url = message_data.get("image_url")
            recipient_username = message_data.get("recipient_username")

            # Find the recipient user by username
            recipient = db.query(models.User).filter(models.User.username == recipient_username).first()
            if not recipient:
                print(f"Recipient {recipient_username} not found")
                raise WebSocketDisconnect

            # Create the message object in the database
            db_message = models.Message(
                content=content,
                image_url=image_url,
                sender_id=client_id,
                recipient_id=recipient.id
            )
            db.add(db_message)
            db.commit()
            db.refresh(db_message)

            # Prepare the message payload to send to the recipient
            message_to_send = {
                "id": db_message.id,
                "content": db_message.content,
                "image_url": db_message.image_url,
                "timestamp": db_message.timestamp.isoformat(),
                "sender_id": db_message.sender_id,
                "recipient_id": db_message.recipient_id,
                "sender": {
                    "id": db_message.sender_id,
                    "username": db_message.sender.username  # Include sender's username
                },
                "recipient": {
                    "id": db_message.recipient_id,
                    "username": db_message.recipient.username  # Include recipient's username
                }
            }

            # Send the message to the recipient
            await manager.send_personal_message(json.dumps(message_to_send), recipient.id)

            # Send the message back to the sender
            await manager.send_personal_message(json.dumps(message_to_send), client_id)

    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected")
        manager.disconnect(websocket, client_id)
    except Exception as e:
        print(f"Error in WebSocket connection for client {client_id}: {str(e)}")
        manager.disconnect(websocket, client_id)
