import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy_repr import RepresentableBase
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Generator

# Load environment variables from .env file
load_dotenv()

# Get DATABASE_URL from environment variables
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise Exception("DATABASE_URL must be set in the environment")

# Create the SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for declarative models
Base = declarative_base(cls=RepresentableBase)

# Dependency to get DB session
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()