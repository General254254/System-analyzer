# /// script
# dependencies = [
#   "fastapi",
#   "uvicorn",
#   "psutil",
#   "wmi; platform_system == 'Windows'",
#   "colorama",
#   "sqlalchemy",
#   "scikit-learn",
#   "pandas",
#   "numpy",
#   "joblib"
# ]
# ///

import uvicorn
import sys
from pathlib import Path

# Add the project root (parent directory) to sys.path so 'backend' package is found
# this allows running the script from either the root OR from within the backend folder
current_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(current_dir.parent))

if __name__ == "__main__":
    print("🚀 Starting SYSTEM HEALTH ANALYZER Backend via uv...")
    print("--------------------------------------------------")
    
    uvicorn.run(
        "backend.api:app", 
        host="127.0.0.1", 
        port=8000, 
        reload=True
    )
