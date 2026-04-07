import argparse
import time
from pathlib import Path
import sys

# Ensure backend package can be imported
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.collector import collect_snapshot
from backend.analyzer import analyze_system
from backend.report import print_terminal_report, export_json_report

def main():
    parser = argparse.ArgumentParser(description="System Health Analyzer - Phase 1")
    parser.add_argument("--watch", action="store_true", help="Continuous 30s refresh mode")
    args = parser.parse_args()
    
    # Reports should go to data/reports relative to project root
    project_root = Path(__file__).parent.parent
    reports_dir = project_root / "data" / "reports"
    
    def run_cycle():
        snapshot = collect_snapshot()
        report = analyze_system(snapshot)
        print_terminal_report(report)
        export_json_report(report, reports_dir)
        
    if args.watch:
        try:
            while True:
                run_cycle()
                time.sleep(30)
        except KeyboardInterrupt:
            print("\nExiting watch mode...")
    else:
        run_cycle()

if __name__ == "__main__":
    main()
