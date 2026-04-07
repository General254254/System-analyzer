import uvicorn
import sys
from pathlib import Path

# Allow importing the 'backend' package correctly
current_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(current_dir.parent))

if __name__ == "__main__":
    print("Starting System Health Analyzer API...")
    uvicorn.run("backend.api:app", host="127.0.0.1", port=8000, reload=True)
