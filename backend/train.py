import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.metrics import mean_absolute_error, mean_squared_error, f1_score, classification_report
import shap
import warnings
warnings.filterwarnings('ignore')

def train_models(data_path="data/synthetic_devices.csv", models_dir="models"):
    print("Loading data...")
    df = pd.read_csv(data_path)
    
    features = [
        'cpu_avg_pct', 'cpu_peak_pct', 'cpu_temp_avg', 
        'ram_avg_pct', 'ram_peak_pct', 'disk_pct_used', 'disk_smart_score', 
        'battery_cycle_count', 'battery_health_pct', 'uptime_hours_per_day', 'age_months'
    ]
    
    X = df[features]
    y_reg = df['lifespan_months']
    y_clf = df['status']
    
    print("Splitting dataset 80/20...")
    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.2, random_state=42
    )
    
    print("Training Model A: RandomForestRegressor...")
    model_a = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model_a.fit(X_train, y_reg_train)
    reg_preds = model_a.predict(X_test)
    
    mae = mean_absolute_error(y_reg_test, reg_preds)
    rmse = np.sqrt(mean_squared_error(y_reg_test, reg_preds))
    print(f"[Model A Evaluation] MAE: {mae:.2f} months, RMSE: {rmse:.2f} months")
    
    print("Training Model B: GradientBoostingClassifier...")
    model_b = GradientBoostingClassifier(n_estimators=100, random_state=42)
    model_b.fit(X_train, y_clf_train)
    clf_preds = model_b.predict(X_test)
    
    f1 = f1_score(y_clf_test, clf_preds, average='weighted')
    print(f"[Model B Evaluation] Weighted F1-Score: {f1:.3f}")
    print("\nClassification Report:")
    print(classification_report(y_clf_test, clf_preds))
    
    out_dir = Path(models_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    
    joblib.dump(model_a, out_dir / 'model_a_regressor.pkl')
    joblib.dump(model_b, out_dir / 'model_b_classifier.pkl')
    print(f"Models saved to {models_dir}")
    
    print("Calculating SHAP feature importance for Model A...")
    explainer = shap.TreeExplainer(model_a)
    shap_values = explainer.shap_values(X_test.iloc[:100])
    
    feature_importance = np.abs(shap_values).mean(axis=0)
    importance_df = pd.DataFrame({'Feature': features, 'Importance': feature_importance})
    importance_df = importance_df.sort_values(by='Importance', ascending=False)
    print("\nTop 5 Important Features for Lifespan:")
    print(importance_df.head(5).to_string(index=False))

if __name__ == "__main__":
    project_root = Path(__file__).resolve().parent.parent
    data_path = project_root / "data" / "synthetic_devices.csv"
    models_path = project_root / "models"
    train_models(str(data_path), str(models_path))
