from dataclasses import dataclass
from typing import Dict, List
from backend.collector import SystemSnapshot

@dataclass
class HealthReport:
    component_scores: Dict[str, int]
    flags: List[str]
    recommendations: List[str]
    overall_score: int
    estimated_lifespan_months: float

def analyze_system(snapshot: SystemSnapshot) -> HealthReport:
    """
    Applies scoring rules to the SystemSnapshot and returns a HealthReport.
    """
    flags = []
    recommendations = []
    
    # ====== CPU ======
    temp_penalty = 0
    if snapshot.cpu_temp is not None:
        if 70 <= snapshot.cpu_temp <= 85:
            temp_penalty = 15
        elif snapshot.cpu_temp > 85:
            temp_penalty = 35
            flags.append("Thermal throttling risk")
            recommendations.append("Clean device vents and check cooling system.")
            
    if snapshot.cpu_percent > 90:
        flags.append("High CPU stress")
        recommendations.append("Close background CPU-intensive applications.")
        
    cpu_score = 100 - (snapshot.cpu_percent * 0.7 + temp_penalty)
    cpu_score = max(0, min(100, int(cpu_score)))
    
    # ====== RAM ======
    if snapshot.ram_percent > 85:
        flags.append("Memory pressure")
        recommendations.append("Consider upgrading RAM or closing unused apps.")
        
    ram_score = 100 - (snapshot.ram_percent * 0.8)
    ram_score = max(0, min(100, int(ram_score)))
    
    # ====== DISK ======
    disk_health = snapshot.disk_smart_health if snapshot.disk_smart_health is not None else 100
    if disk_health < 70:
        flags.append("Disk failure risk")
        recommendations.append("Backup data immediately and replace disk.")
        
    if snapshot.disk_percent > 90:
        flags.append("Low disk space")
        recommendations.append("Free up disk space to prevent system slowdowns.")
        
    disk_score = max(0, min(100, int(disk_health)))
    
    # ====== BATTERY ======
    batt_score = 100
    is_laptop = snapshot.battery_percent is not None
    if is_laptop:
        # Without deeper iteration via wmi, we just assume optimal health for Phase 1
        batt_score = 100 
        
    # ====== OVERALL ======
    if is_laptop:
        overall = (cpu_score * 0.3) + (ram_score * 0.25) + (disk_score * 0.35) + (batt_score * 0.1)
    else:
        overall = (cpu_score * 0.33) + (ram_score * 0.28) + (disk_score * 0.39)
        
    overall_score = max(0, min(100, int(overall)))
    
    from backend.predictor import predict_lifespan, predict_status
    est_lifespan = predict_lifespan(snapshot, overall_score)
    status, confidence = predict_status(snapshot, overall_score)
    
    if status == 'critical' and "System status critical" not in flags:
        flags.append(f"System status: Critical (ML Confidence: {confidence:.1f}%)")
        recommendations.append("Immediate system maintenance highly recommended.")
    elif status == 'at_risk' and "System status at risk" not in flags:
        flags.append(f"System status: At Risk (ML Confidence: {confidence:.1f}%)")
        recommendations.append("System is deteriorating, consider proactive maintenance.")
    
    return HealthReport(
        component_scores={
            "CPU": cpu_score,
            "RAM": ram_score,
            "Disk": disk_score,
            "Battery": batt_score if is_laptop else -1
        },
        flags=flags,
        recommendations=recommendations,
        overall_score=overall_score,
        estimated_lifespan_months=round(est_lifespan, 1)
    )
