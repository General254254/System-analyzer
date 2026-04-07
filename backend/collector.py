import platform
import psutil
from dataclasses import dataclass
from typing import Optional, Dict, Any

@dataclass
class SystemSnapshot:
    os_info: str
    hostname: str
    architecture: str
    
    cpu_percent: float
    cpu_freq_current: float
    cpu_count: int
    
    ram_used_bytes: int
    ram_total_bytes: int
    ram_percent: float
    
    disk_used_bytes: int
    disk_free_bytes: int
    disk_percent: float
    disk_smart_health: Optional[int]
    
    cpu_temp: Optional[float]
    
    battery_percent: Optional[float]
    battery_secsleft: Optional[int]
    battery_plugged: Optional[bool]
    
    def to_dict(self) -> Dict[str, Any]:
        return self.__dict__

def get_disk_smart_health() -> Optional[int]:
    """
    Query SMART disk health attributes on Windows using WMI.
    Returns a normalized health score 0-100 if available, else None.
    """
    if platform.system() != "Windows":
        return None
    try:
        import wmi
        c = wmi.WMI(namespace="root\\wmi")
        failure_predict = c.MSStorageDriver_FailurePredictStatus()
        
        health = 100
        for drive in failure_predict:
            if drive.PredictFailure:
                health = 10
                break
        return health
    except Exception:
        # Fallback if WMI fails or requires admin rights
        return None

def collect_snapshot() -> SystemSnapshot:
    """
    Collects raw system metrics to create a snapshot of the current state.
    """
    uname = platform.uname()
    
    cpu_pct = psutil.cpu_percent(interval=1)
    cpu_freq = psutil.cpu_freq()
    cpu_count = psutil.cpu_count(logical=True)
    
    svmem = psutil.virtual_memory()
    
    disk_usage = psutil.disk_usage('/')
    smart_health = get_disk_smart_health()
    
    temps = None
    if hasattr(psutil, "sensors_temperatures"):
        try:
            sensors = psutil.sensors_temperatures()
            if sensors:
                max_t = 0.0
                for _, entries in sensors.items():
                    for entry in entries:
                        if entry.current > max_t:
                            max_t = entry.current
                if max_t > 0:
                    temps = max_t
        except Exception:
            pass

    batt_pct, batt_secs, batt_plugged = None, None, None
    if hasattr(psutil, "sensors_battery"):
        try:
            batt = psutil.sensors_battery()
            if batt:
                batt_pct = batt.percent
                batt_secs = batt.secsleft
                batt_plugged = batt.power_plugged
        except Exception:
            pass

    return SystemSnapshot(
        os_info=f"{uname.system} {uname.release}",
        hostname=uname.node,
        architecture=uname.machine,
        
        cpu_percent=cpu_pct,
        cpu_freq_current=cpu_freq.current if cpu_freq else 0.0,
        cpu_count=cpu_count or 1,
        
        ram_used_bytes=svmem.used,
        ram_total_bytes=svmem.total,
        ram_percent=svmem.percent,
        
        disk_used_bytes=disk_usage.used,
        disk_free_bytes=disk_usage.free,
        disk_percent=disk_usage.percent,
        disk_smart_health=smart_health,
        
        cpu_temp=temps,
        
        battery_percent=batt_pct,
        battery_secsleft=batt_secs,
        battery_plugged=batt_plugged
    )
