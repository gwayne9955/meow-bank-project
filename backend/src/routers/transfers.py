from enum import Enum

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from src.database import get_db
from src.exceptions import InsufficientFundsError, CurrencyMismatchException
from src.repositories.fund_transfer_repo import FundTransferRepo
from src.schemas.fund_transfer import FundTransferCreate, FundTransfer as FundTransferSchema
from src.services.transfer_service import TransferService

router = APIRouter()


class SortColumns(str, Enum):
    id = "id"
    from_account = "from_account"
    to_account = "to_account"
    amount_cents = "amount_cents"
    created_at = "created_at"

# Create an enum for sort direction
class SortDirection(str, Enum):
    asc = "asc"
    desc = "desc"

@router.get("/accounts/{account_id}", response_model=List[FundTransferSchema])
def list_all_for_account(
        account_id: int,
        sort_by: Optional[SortColumns] = Query(
                default=SortColumns.id,
                description="Column to sort by"
            ),
            sort_direction: Optional[SortDirection] = Query(
                default=SortDirection.asc,
                description="Sort direction"
            ),
                db: Session = Depends(get_db)
        ):
    repo = FundTransferRepo(db)
    return repo.list_for_account(account_id, sort_by, sort_direction == SortDirection.desc)


@router.post("/", response_model=FundTransferSchema)
def create_transfer(
    transfer_request: FundTransferCreate,  # This will automatically parse the request body
    db: Session = Depends(get_db)
):
    transfer_service = TransferService(db)
    try:
        return transfer_service.transfer_funds(transfer_request)
    except (ValueError, InsufficientFundsError, CurrencyMismatchException) as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
