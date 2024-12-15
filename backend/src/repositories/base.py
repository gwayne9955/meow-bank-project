from sqlalchemy.orm import Session
from typing import Generic, TypeVar, Type
from sqlalchemy import desc, asc

T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], db: Session):
        self.model = model
        self.db = db

    def get(self, id: int) -> T:
        return self.db.query(self.model).filter(self.model.id == id).first()

    def list(self, sort_by: str = 'id', descending: bool = False):
        query = self.db.query(self.model)

        # Get the column to sort by
        sort_column = getattr(self.model, sort_by, self.model.id)

        # Apply sort direction
        if descending:
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))

        return query.all()