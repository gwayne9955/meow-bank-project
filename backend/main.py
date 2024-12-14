from fastapi import FastAPI

from src.routers import users, accounts, transfers

app = FastAPI()


# Include routers
# app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(accounts.router, prefix="/api/accounts", tags=["accounts"])
app.include_router(transfers.router, prefix="/api/transfers", tags=["transfers"])
