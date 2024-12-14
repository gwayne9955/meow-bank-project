from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean
from src.database import Base

class BankAccount(Base):
    __tablename__ = "bank_accounts"

    id = Column(Integer, primary_key=True)
    account_name = Column(String)
    customer_id = Column(Integer)
    balance_cents = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, default=datetime.now(timezone.utc))
    notes = Column(String)
    deleted = Column(Boolean, default=False)
    currency = Column(String, default="USD")
