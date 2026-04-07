import pandas as pd
import numpy as np
from pathlib import Path

def generate_synthetic_data(num_samples=5000, output_path="data/synthetic_devices.csv"):
    np.random.seed(42)
    
    # Generate features
    cpu_avg_pct = np.random.uniform(5, 95, num_samples)
    cpu_peak_pct = np.clip(cpu_avg_pct + np.random.uniform(5, 30, num_samples), 10, 100)
    cpu_temp_avg = np.random.normal(65, 15, num_samples)
    
    ram_avg_pct = np.random.uniform(20, 95, num_samples)
    ram_peak_pct = np.clip(ram_avg_pct + np.random.uniform(5, 20, num_samples), 25, 100)
    
    disk_pct_used = np.random.uniform(10, 98, num_samples)
    disk_smart_score = np.random.uniform(30, 100, num_samples)
    
    battery_cycle_count = np.random.randint(0, 1500, num_samples)
    battery_health_pct = np.clip(100 - (battery_cycle_count / 15), 10, 100)
    
    uptime_hours_per_day = np.random.uniform(1, 24, num_samples)
    age_months = np.random.randint(1, 60, num_samples)
    
    df = pd.DataFrame({
        'cpu_avg_pct': cpu_avg_pct,
        'cpu_peak_pct': cpu_peak_pct,
        'cpu_temp_avg': cpu_temp_avg,
        'ram_avg_pct': ram_avg_pct,
        'ram_peak_pct': ram_peak_pct,
        'disk_pct_used': disk_pct_used,
        'disk_smart_score': disk_smart_score,
        'battery_cycle_count': battery_cycle_count,
        'battery_health_pct': battery_health_pct,
        'uptime_hours_per_day': uptime_hours_per_day,
        'age_months': age_months
    })
    
    # Construct target variables based on reasonable heuristics
    base_lifespan = 60.0
    
    temp_penalty = np.where(df['cpu_temp_avg'] > 80, (df['cpu_temp_avg'] - 80) * 0.5, 0)
    disk_penalty = np.where(df['disk_smart_score'] < 70, (70 - df['disk_smart_score']) * 0.4, 0)
    battery_penalty = np.where(df['battery_health_pct'] < 50, (50 - df['battery_health_pct']) * 0.3, 0)
    age_penalty = df['age_months'] * 0.8
    
    lifespan_months = base_lifespan - temp_penalty - disk_penalty - battery_penalty - age_penalty
    df['lifespan_months'] = np.clip(lifespan_months, 0.5, 60.0)
    
    conditions = [
        (df['lifespan_months'] > 24),
        (df['lifespan_months'] > 6) & (df['lifespan_months'] <= 24),
        (df['lifespan_months'] <= 6)
    ]
    choices = ['healthy', 'at_risk', 'critical']
    df['status'] = np.select(conditions, choices, default='healthy')
    
    out_dir = Path(output_path).parent
    out_dir.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {num_samples} records to {output_path}")

if __name__ == "__main__":
    project_root = Path(__file__).resolve().parent.parent
    gen_path = project_root / "data" / "synthetic_devices.csv"
    generate_synthetic_data(num_samples=5000, output_path=str(gen_path))
