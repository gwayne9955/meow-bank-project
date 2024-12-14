from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from src.database import get_db
from src.repositories.bank_account_repo import BankAccountRepo
from src.schemas.bank_account import BankAccountCreate, BankAccount as BankAccountSchema

router = APIRouter()


@router.get("/{account_id}", response_model=BankAccountSchema)
def get_account(
        account_id: int,
        db: Session = Depends(get_db)
):
    repo = BankAccountRepo(db)

    account = repo.get(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    return account


@router.get("/", response_model=List[BankAccountSchema])
def list_all(
        db: Session = Depends(get_db)
):
    repo = BankAccountRepo(db)
    return repo.list()


@router.post("/", response_model=BankAccountSchema)
def create_account(
    account: BankAccountCreate,  # This will automatically parse the request body
    db: Session = Depends(get_db)
):
    try:
        repo = BankAccountRepo(db)
        return repo.create(account)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{account_id}")
def delete_account(
    account_id: int,
    db: Session = Depends(get_db)
):
    repo = BankAccountRepo(db)

    try:
        account = repo.soft_delete(account_id)
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    return None # Return 200