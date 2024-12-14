from sqlalchemy.orm import Session

from src.exceptions import CurrencyMismatchException, InsufficientFundsError, SameAccountTransferException, \
    AccountNotFoundError
from src.repositories.bank_account_repo import BankAccountRepo
from src.repositories.fund_transfer_repo import FundTransferRepo
from src.schemas.fund_transfer import FundTransferCreate


class TransferService:
    def __init__(self, db: Session):
        self.db = db
        self.bank_account_repo = BankAccountRepo(db)
        self.fund_transfer_repo = FundTransferRepo(db)

    def transfer_funds(self, transfer_request: FundTransferCreate):
        # Start transaction
        try:
            if transfer_request.from_account == transfer_request.to_account:
                raise SameAccountTransferException("The to and from accounts must differ")

            # Get the bank accounts
            from_account = self.bank_account_repo.get(transfer_request.from_account)
            to_account = self.bank_account_repo.get(transfer_request.to_account)

            if from_account is None or to_account is None:
                raise AccountNotFoundError("One or both accounts not found")

            # Assert currency match (until we support forex conversions)
            if from_account.currency != to_account.currency:
                raise CurrencyMismatchException("Transfers are only supported for accounts of the same currency")

            if from_account.balance_cents < transfer_request.amount_cents:
                raise InsufficientFundsError("The account you are trying to transfer from does not have enough funds")

            # Update account balances for the transfer amount
            self.bank_account_repo.update_balance(
                from_account.id,
                from_account.balance_cents - transfer_request.amount_cents
            )

            self.bank_account_repo.update_balance(
                to_account.id,
                to_account.balance_cents + transfer_request.amount_cents
            )

            # Create the transfer object
            transfer = self.fund_transfer_repo.create(transfer_request)

            # Commit the transaction
            self.db.commit()
            return transfer

        except Exception as e:
            # Rollback on any error
            self.db.rollback()
            raise e