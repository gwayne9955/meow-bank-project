class DatabaseOperationError(Exception):
    """Raised when a database operation fails"""
    pass

class AccountNotFoundError(Exception):
    """Raised when an account is not found"""
    pass

class InsufficientFundsError(Exception):
    """Raised when an account has insufficient funds for an operation"""
    pass

class CurrencyMismatchException(Exception):
    """Raised when a transfer is attempted for bank accounts with different currencies"""
    pass

class SameAccountTransferException(Exception):
    """Raised when trying to transfer money to and from the same account"""
    pass
