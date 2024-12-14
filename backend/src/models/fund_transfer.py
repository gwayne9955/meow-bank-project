from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, TIMESTAMP
from src.database import Base

class FundTransfer(Base):
    __tablename__ = "fund_transfers"

    id = Column(Integer, primary_key=True)
    from_account = Column(Integer)
    to_account = Column(Integer)
    amount_cents = Column(Integer)
    created_at = Column(TIMESTAMP, default=datetime.now(timezone.utc))
    notes = Column(String)
