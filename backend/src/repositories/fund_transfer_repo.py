from src.models.fund_transfer import FundTransfer
from src.repositories.base import BaseRepository
from src.schemas.fund_transfer import FundTransferCreate
from sqlalchemy import or_, asc, desc


class FundTransferRepo(BaseRepository[FundTransfer]):
    def __init__(self, db):
        super().__init__(FundTransfer, db)

    def create(self, transfer_data: FundTransferCreate):
        db_data = transfer_data.model_dump(exclude_unset=True)
        db_transfer = self.model(**db_data)
        self.db.add(db_transfer)
        self.db.flush()  # Don't commit - let transfer service handle transaction
        return db_transfer

    def list_for_account(self, account_id: int, sort_by: str = 'id', descending: bool = False):
        base_query = (self.db.query(self.model)
                     .filter(or_(FundTransfer.to_account == account_id, FundTransfer.from_account == account_id)))

        # Get the column to sort by
        sort_column = getattr(self.model, sort_by, self.model.id)

        # Apply sort direction
        if descending:
            base_query = base_query.order_by(desc(sort_column))
        else:
            base_query = base_query.order_by(asc(sort_column))

        return base_query.all()