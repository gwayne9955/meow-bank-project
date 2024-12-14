FROM python:3.9

WORKDIR /backend

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN apk add --no-cache libpq postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev python3-dev && \
    pip install --no-cache-dir -r requirements.txt && \
    apk --purge del .build-deps

# Copy rest of the code
COPY . .

# Expose port
EXPOSE 8000

# Run FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]