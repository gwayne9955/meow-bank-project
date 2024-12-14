from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from src.database import get_db
from src.exceptions import InsufficientFundsError, CurrencyMismatchException
from src.repositories.fund_transfer_repo import FundTransferRepo
from src.schemas.fund_transfer import FundTransferCreate, FundTransfer as FundTransferSchema
from src.services.transfer_service import TransferService

router = APIRouter()


@router.get("/accounts/{account_id}", response_model=List[FundTransferSchema])
def list_all_for_account(
        account_id: int,
        db: Session = Depends(get_db)
):
    repo = FundTransferRepo(db)
    return repo.list_for_account(account_id)


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
