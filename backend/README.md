# System Health Analyzer - Backend API

A FastAPI-based backend that monitors system health, analyzes hardware metrics, and provides real-time insights to the frontend.

## Setup

### Install Dependencies

With UV (recommended):
```bash
uv sync
```

Or with pip:
```bash
pip install -r requirements.txt
```

## Running the API

### Development Server

```bash
uvicorn backend.api:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Interactive API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## API Endpoints

### GET `/metrics`
Returns current system metrics snapshot.
- **Refresh Rate**: Every 5 seconds (frontend)
- **Response**: System metrics dictionary with CPU, memory, disk, and hardware info

### GET `/health`
Returns the latest health analysis report.
- **Response**: 
  ```json
  {
    "component_scores": {...},
    "flags": [...],
    "recommendations": [...],
    "overall_score": 0-100,
    "estimated_lifespan_months": number
  }
  ```

### POST `/report`
Triggers a new system scan, analyzes it, and stores the report in the database.
- **Database**: SQLite stored in `data/logs.db`
- **JSON Export**: Reports exported to `data/reports/`
- **Response**: Full health report

### GET `/history`
Retrieves historical reports from the database.
- **Query Parameters**:
  - `limit` (optional, default: 100): Maximum number of reports to return
- **Response**: Array of historical reports with timestamps

## Architecture

- **Framework**: FastAPI with Uvicorn
- **Database**: SQLAlchemy with SQLite
- **System Monitoring**: psutil for metrics collection
- **Analysis**: scikit-learn for ML-based predictions
- **CORS**: Enabled for frontend communication

## Frontend Integration

The frontend connects to the backend at `http://localhost:8000`:
- `useMetrics()` hook: Polls `/metrics` every 5 seconds
- `useHealth()` hook: Fetches `/health` and can trigger `/report` POST requests

Make sure both backend and frontend are running for the full experience.
