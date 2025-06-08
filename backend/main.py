from fastapi import FastAPI, WebSocket, HTTPException, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import json
import logging
from datetime import datetime
from video_service import VideoService, Room

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Video Call API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/rooms/create")
async def create_room():
    try:
        return VideoService.create_room()
    except Exception as e:
        logger.error(f"Error creating room: {e}")
        raise HTTPException(status_code=500, detail="Failed to create room")

@app.get("/api/rooms/verify/{room_id}")
async def verify_room(room_id: str, room_key: str):
    try:
        return VideoService.verify_room(room_id, room_key)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying room: {e}")
        raise HTTPException(status_code=500, detail="Failed to verify room")

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_rooms": VideoService.get_room_count()
    }

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    participant_id = None
    room = None
    
    try:
        # Get room key from query parameter
        room_key = websocket.query_params.get("key")
        logger.info(f"WebSocket connection attempt - Room ID: {room_id}, Key: {room_key}")
        
        if not room_key:
            logger.error("Missing room key")
            await websocket.close(code=1008, reason="Missing room key")
            return

        room = VideoService.get_room(room_id)
        if not room:
            logger.error(f"Room not found: {room_id}")
            await websocket.close(code=1008, reason="Room not found")
            return
            
        if room.room_key != room_key:
            logger.error(f"Invalid room key for room {room_id}")
            await websocket.close(code=1008, reason="Invalid room key")
            return

        await websocket.accept()
        logger.info(f"WebSocket connection accepted for room {room_id}")
        
        # Generate unique participant ID
        participant_id = f"user_{len(room.participants) + 1}_{datetime.now().timestamp()}"
        room.participants[participant_id] = websocket
        
        logger.info(f"Participant {participant_id} joined room {room_id}")
        
        # Notify others about new participant
        await broadcast_to_room(room, {
            "type": "participant_joined",
            "participant_id": participant_id,
            "participant_count": len(room.participants)
        }, exclude_participant=participant_id)

        # Handle messages
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                message["sender_id"] = participant_id
                
                if message.get("type") == "leave":
                    break
                    
                await broadcast_to_room(room, message, exclude_participant=participant_id)
                
            except WebSocketDisconnect:
                break
            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON received from {participant_id}")
                continue
            except Exception as e:
                logger.error(f"Error handling message from {participant_id}: {e}")
                break
                
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for participant {participant_id}")
    except Exception as e:
        logger.error(f"Error in WebSocket connection: {e}")
        try:
            await websocket.close(code=1011)
        except:
            pass
    finally:
        # Cleanup
        if room and participant_id and participant_id in room.participants:
            del room.participants[participant_id]
            logger.info(f"Participant {participant_id} left room {room_id}")
            
            # Notify others about participant leaving
            await broadcast_to_room(room, {
                "type": "participant_left",
                "participant_id": participant_id,
                "participant_count": len(room.participants)
            })
            
            # Remove room if empty
            if len(room.participants) == 0:
                VideoService.remove_room(room_id)
                logger.info(f"Room {room_id} removed (empty)")

async def broadcast_to_room(room: Room, message: dict, exclude_participant: str = None):
    """Broadcast message to all participants in a room except the excluded one"""
    if not room.participants:
        return
        
    disconnected_participants = []
    
    for participant_id, websocket in room.participants.items():
        if participant_id != exclude_participant:
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.warning(f"Failed to send message to {participant_id}: {e}")
                disconnected_participants.append(participant_id)
    
    # Clean up disconnected participants
    for participant_id in disconnected_participants:
        if participant_id in room.participants:
            del room.participants[participant_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        log_level="info",
        access_log=True,
        reload=True,
        workers=1
    )