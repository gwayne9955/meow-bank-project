from sqlalchemy.orm import Session
from typing import Generic, TypeVar, Type

T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], db: Session):
        self.model = model
        self.db = db

    def get(self, id: int) -> T:
        return self.db.query(self.model).filter(self.model.id == id).first()

    def list(self):
        return self.db.query(self.model).all()