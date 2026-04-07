import joblib
from pathlib import Path
from backend.collector import SystemSnapshot

# Attempt to load models at module startup
models_path = Path(__file__).resolve().parent.parent / "models"
model_a = None
model_b = None

try:
    if (models_path / 'model_a_regressor.pkl').exists():
        model_a = joblib.load(models_path / 'model_a_regressor.pkl')
    if (models_path / 'model_b_classifier.pkl').exists():
        model_b = joblib.load(models_path / 'model_b_classifier.pkl')
except Exception as e:
    print(f"Warning: Failed to load ML models: {e}")

def prepare_features(snapshot: SystemSnapshot) -> list:
    # Match the order:
    # ['cpu_avg_pct', 'cpu_peak_pct', 'cpu_temp_avg', 'ram_avg_pct', 'ram_peak_pct', 
    #  'disk_pct_used', 'disk_smart_score', 'battery_cycle_count', 'battery_health_pct', 
    #  'uptime_hours_per_day', 'age_months']
    
    cpu_pct = snapshot.cpu_percent
    cpu_temp = snapshot.cpu_temp if snapshot.cpu_temp is not None else 50.0
    ram_pct = snapshot.ram_percent
    disk_pct = snapshot.disk_percent
    disk_smart = snapshot.disk_smart_health if snapshot.disk_smart_health is not None else 100.0
    
    # Approximations since we don't track cycles/age yet
    batt_cycles = 100
    batt_health = snapshot.battery_percent if snapshot.battery_percent is not None else 100.0
    
    uptime = 8.0 # default approximate
    age = 12.0   # default approximate
    
    return [
        cpu_pct, cpu_pct * 1.1, cpu_temp,
        ram_pct, ram_pct * 1.05,
        disk_pct, disk_smart,
        batt_cycles, batt_health,
        uptime, age
    ]

def predict_lifespan(snapshot: SystemSnapshot, overall_score: int) -> float:
    """Predicts device lifespan in months. Uses ML if available, else rule-based fallback."""
    if model_a is not None:
        try:
            feats = prepare_features(snapshot)
            pred = model_a.predict([feats])[0]
            return float(pred)
        except Exception:
            pass
    # Basic rule-based fallback (v1)
    return (overall_score / 100.0) * 36.0

def predict_status(snapshot: SystemSnapshot, overall_score: int) -> tuple[str, float]:
    """Predicts status string and confidence. Uses ML if available, else rule-based fallback."""
    if model_b is not None:
        try:
            feats = prepare_features(snapshot)
            probs = model_b.predict_proba([feats])[0]
            classes = model_b.classes_
            
            top_idx = probs.argmax()
            status = classes[top_idx]
            confidence = probs[top_idx] * 100.0
            return status, confidence
        except Exception:
            pass
    
    # Fallback rules
    if overall_score >= 80:
        return 'healthy', 100.0
    elif overall_score >= 50:
        return 'at_risk', 100.0
    else:
        return 'critical', 100.0
