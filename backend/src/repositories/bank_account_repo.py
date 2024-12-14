from datetime import datetime, timezone

from src.exceptions import DatabaseOperationError
from src.models.bank_account import BankAccount
from src.repositories.base import BaseRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.bank_account import BankAccountCreate


class BankAccountRepo(BaseRepository[BankAccount]):
    def __init__(self, db):
        super().__init__(BankAccount, db)

    def create(self, account_data: BankAccountCreate):
        try:
            db_data = account_data.model_dump(exclude_unset=True)
            db_account = self.model(**db_data)

            # Add to database
            self.db.add(db_account)
            self.db.commit()
            # Refresh to get the created ID and any default values
            self.db.refresh(db_account)

            return db_account

        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseOperationError(f"Error creating account: {str(e)}")

    def soft_delete(self, account_id: int):
        """Marks account as deleted without removing from database"""
        account = self.get(account_id)
        if not account:
            return None

        try:
            account.deleted = True
            self.db.commit()
            return account
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseOperationError(f"Error deleting account: {str(e)}")

    def update_balance(self, account_id: int, new_balance: int):
        account = self.get(account_id)
        account.balance_cents = new_balance
        self.db.flush()
        return account
