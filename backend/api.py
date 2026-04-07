from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.collector import collect_snapshot
from backend.analyzer import analyze_system
from backend.database import SessionLocal, DBHealthReport
from backend.report import export_json_report
from pathlib import Path

app = FastAPI(title="System Health Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

_latest_report = None
_latest_snapshot = None

@app.get("/metrics")
def get_metrics():
    global _latest_snapshot
    _latest_snapshot = collect_snapshot()
    return _latest_snapshot.to_dict()

@app.get("/health")
def get_health():
    global _latest_report, _latest_snapshot
    if _latest_report is None:
        if _latest_snapshot is None:
            _latest_snapshot = collect_snapshot()
        _latest_report = analyze_system(_latest_snapshot)
    
    return {
        "component_scores": _latest_report.component_scores,
        "flags": _latest_report.flags,
        "recommendations": _latest_report.recommendations,
        "overall_score": _latest_report.overall_score,
        "estimated_lifespan_months": _latest_report.estimated_lifespan_months
    }

@app.post("/report")
def create_report(db: Session = Depends(get_db)):
    global _latest_report, _latest_snapshot
    _latest_snapshot = collect_snapshot()
    _latest_report = analyze_system(_latest_snapshot)
    
    db_report = DBHealthReport(
        overall_score=_latest_report.overall_score,
        estimated_lifespan_months=_latest_report.estimated_lifespan_months,
        component_scores=_latest_report.component_scores,
        flags=_latest_report.flags,
        recommendations=_latest_report.recommendations
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    project_root = Path(__file__).resolve().parent.parent
    reports_dir = project_root / "data" / "reports"
    export_json_report(_latest_report, reports_dir)
    
    return {
        "component_scores": _latest_report.component_scores,
        "flags": _latest_report.flags,
        "recommendations": _latest_report.recommendations,
        "overall_score": _latest_report.overall_score,
        "estimated_lifespan_months": _latest_report.estimated_lifespan_months
    }

@app.get("/history")
def get_history(limit: int = 100, db: Session = Depends(get_db)):
    reports = db.query(DBHealthReport).order_by(DBHealthReport.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "timestamp": r.timestamp.isoformat(),
            "overall_score": r.overall_score,
            "estimated_lifespan_months": r.estimated_lifespan_months,
            "component_scores": r.component_scores,
            "flags": r.flags,
            "recommendations": r.recommendations
        } for r in reports
    ]
