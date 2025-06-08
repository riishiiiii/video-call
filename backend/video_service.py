import random
import string
from datetime import datetime
from typing import Dict
from fastapi import WebSocket, HTTPException

class Room:
    def __init__(self, room_id: str, room_key: str):
        self.room_id = room_id
        self.room_key = room_key
        self.participants: Dict[str, WebSocket] = {}
        self.created_at = datetime.now()

class VideoService:
    _instance = None
    _active_rooms: Dict[str, Room] = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VideoService, cls).__new__(cls)
        return cls._instance
    
    @classmethod
    def create_room(cls):
        room_id = cls.generate_room_id()
        room_key = cls.generate_room_key()
        
        # Ensure unique room ID
        while room_id in cls._active_rooms:
            room_id = cls.generate_room_id()
        
        room = {"room_id": room_id, "room_key": room_key}
        print(f"Created room: {room}")  # Debug log
        cls._active_rooms[room_id] = Room(room_id, room_key)
        return room
    
    @staticmethod
    def generate_room_id():
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    @staticmethod
    def generate_room_key():
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

    @classmethod
    def verify_room(cls, room_id: str, room_key: str):
        if room_id not in cls._active_rooms:
            raise HTTPException(status_code=404, detail="Room not found")
    
        room = cls._active_rooms[room_id]
        if room.room_key != room_key:
            raise HTTPException(status_code=401, detail="Invalid room key")
        
        return {"valid": True}
    
    @classmethod
    def get_room(cls, room_id: str) -> Room:
        return cls._active_rooms.get(room_id)
    
    @classmethod
    def remove_room(cls, room_id: str):
        if room_id in cls._active_rooms:
            del cls._active_rooms[room_id]
    
    @classmethod
    def get_room_count(cls) -> int:
        return len(cls._active_rooms)