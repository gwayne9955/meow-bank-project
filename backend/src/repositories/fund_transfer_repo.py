from src.models.fund_transfer import FundTransfer
from src.repositories.base import BaseRepository
from src.schemas.fund_transfer import FundTransferCreate


class FundTransferRepo(BaseRepository[FundTransfer]):
    def __init__(self, db):
        super().__init__(FundTransfer, db)

    def create(self, transfer_data: FundTransferCreate):
        db_data = transfer_data.model_dump(exclude_unset=True)
        db_transfer = self.model(**db_data)
        self.db.add(db_transfer)
        self.db.flush()  # Don't commit - let transfer service handle transaction
        return db_transfer

    def list_for_account(self, account_id: int):
        transfers = (self.db.query(self.model)
                     .where(FundTransfer.to_account == account_id or FundTransfer.from_account == account_id))
        return transfers