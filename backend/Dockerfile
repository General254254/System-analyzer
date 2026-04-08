FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (for psutil and wmi)
RUN apt-get update && apt-get install -y --no-cache \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY backend/pyproject.toml .
RUN pip install --no-cache-dir -e .

# Copy backend code
COPY backend/ .

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
