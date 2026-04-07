import json
from datetime import datetime
from colorama import init, Fore, Style
from pathlib import Path
from backend.analyzer import HealthReport

# Initialize colorama
init(autoreset=True)

def print_terminal_report(report: HealthReport):
    """
    Renders the health report to the terminal using colorama.
    """
    print("-" * 50)
    print(Style.BRIGHT + Fore.CYAN + "SYSTEM HEALTH ANALYZER - PHASE 1 REPORT")
    print("-" * 50)
    
    color = Fore.GREEN if report.overall_score >= 80 else (Fore.YELLOW if report.overall_score >= 50 else Fore.RED)
    print(f"Overall Health Score: {color}{report.overall_score}/100")
    print(f"Estimated Lifespan: {Style.BRIGHT}{report.estimated_lifespan_months} months\n")
    
    print(Style.BRIGHT + "Component Scores:")
    for comp, score in report.component_scores.items():
        if score == -1:
            print(f"  {comp}: {Fore.LIGHTBLACK_EX}N/A")
            continue
        c_color = Fore.GREEN if score >= 80 else (Fore.YELLOW if score >= 50 else Fore.RED)
        severity = "Good" if score >= 80 else ("Moderate" if score >= 50 else "Critical")
        print(f"  {comp}: {c_color}{score}/100 {Style.DIM}({severity})")
    
    print("\n" + Style.BRIGHT + "Anomalies / Flags:")
    if not report.flags:
        print(Fore.GREEN + "  No issues detected.")
    else:
        for flag in report.flags:
            print(Fore.RED + f"  - {flag}")
            
    print("\n" + Style.BRIGHT + "Recommendations:")
    if not report.recommendations:
        print(Fore.GREEN + "  System running optimally.")
    else:
        for idx, rec in enumerate(report.recommendations[:3], 1):
            print(Fore.YELLOW + f"  {idx}. {rec}")
    
    print("-" * 50)


def export_json_report(report: HealthReport, output_dir: Path):
    """
    Saves the HealthReport to a JSON file in the specified output directory.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = output_dir / f"report_{timestamp}.json"
    
    report_dict = {
        "component_scores": report.component_scores,
        "flags": report.flags,
        "recommendations": report.recommendations,
        "overall_score": report.overall_score,
        "estimated_lifespan_months": report.estimated_lifespan_months,
        "timestamp": datetime.now().isoformat()
    }
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(report_dict, f, indent=4)
        
    print(Fore.LIGHTBLACK_EX + f"Report saved at: {filename}")
