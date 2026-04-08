#!/usr/bin/env python3
"""Generate an agentic SEO audit report from structured JSON evidence.

Usage:
  python app/audit_agent.py --input data/sample_audit_input.json --output output/report.md
"""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any, Dict, List


@dataclass
class Finding:
    category: str
    issue: str
    evidence: str
    recommendation: str
    impact: int
    effort: int
    confidence: int
    severity: str = "Medium"

    @property
    def priority_score(self) -> float:
        if self.effort <= 0:
            return 0.0
        return round((self.impact * self.confidence) / self.effort, 2)


def _int(v: Any, default: int = 3) -> int:
    try:
        return int(v)
    except (TypeError, ValueError):
        return default


def parse_findings(rows: List[Dict[str, Any]]) -> List[Finding]:
    findings: List[Finding] = []
    for row in rows:
        findings.append(
            Finding(
                category=str(row.get("category", "technical")).lower(),
                issue=str(row.get("issue", "")),
                evidence=str(row.get("evidence", "")),
                recommendation=str(row.get("recommendation", "")),
                impact=_int(row.get("impact"), 3),
                effort=max(1, _int(row.get("effort"), 3)),
                confidence=_int(row.get("confidence"), 3),
                severity=str(row.get("severity", "Medium")),
            )
        )
    return findings


def build_report(payload: Dict[str, Any]) -> str:
    meta = payload.get("meta", {})
    findings = parse_findings(payload.get("findings", []))

    top = sorted(findings, key=lambda f: f.priority_score, reverse=True)[:5]

    def by_category(cat: str) -> List[Finding]:
        return [f for f in findings if f.category == cat]

    technical = by_category("technical")
    content = by_category("content")
    links = by_category("internal_links")
    serp = by_category("serp")

    lines: List[str] = []
    lines.append("# Agentic SEO Audit Report")
    lines.append("")
    lines.append(f"- **Client / Project:** {meta.get('client', 'N/A')}")
    lines.append(f"- **Domain:** {meta.get('domain', 'N/A')}")
    lines.append(f"- **Audit date:** {meta.get('audit_date', str(date.today()))}")
    lines.append(f"- **Auditor / Agent system:** {meta.get('auditor', 'AI SEO Agent')}")
    lines.append(f"- **Data window:** {meta.get('data_window', 'N/A')}")
    lines.append("")
    lines.append("## Executive summary")
    lines.append("")
    lines.append(f"**Objective:** {meta.get('objective', 'Improve organic growth and conversion quality.')}")
    lines.append("")
    lines.append("### Top prioritized findings")
    for i, f in enumerate(top, start=1):
        lines.append(
            f"{i}. **{f.issue}** (Score: {f.priority_score}) — {f.recommendation}"
        )
    if not top:
        lines.append("1. No findings supplied.")

    def table(rows: List[Finding]) -> None:
        lines.append("| Issue | Evidence | Severity | Impact | Effort | Confidence | Score | Recommendation |")
        lines.append("|---|---|---:|---:|---:|---:|---:|---|")
        if not rows:
            lines.append("| - | - | - | - | - | - | - | - |")
            return
        for f in rows:
            lines.append(
                f"| {f.issue} | {f.evidence} | {f.severity} | {f.impact} | {f.effort} | {f.confidence} | {f.priority_score} | {f.recommendation} |"
            )

    lines.append("")
    lines.append("## Findings")
    lines.append("")
    lines.append("### Technical SEO")
    table(technical)
    lines.append("")
    lines.append("### Content & intent")
    table(content)
    lines.append("")
    lines.append("### Internal links")
    table(links)
    lines.append("")
    lines.append("### SERP gaps")
    table(serp)

    roadmap = sorted(findings, key=lambda f: f.priority_score, reverse=True)
    lines.append("")
    lines.append("## Prioritized roadmap")
    lines.append("")
    lines.append("| Initiative | Impact | Effort | Confidence | Priority Score |")
    lines.append("|---|---:|---:|---:|---:|")
    for f in roadmap:
        lines.append(
            f"| {f.issue} | {f.impact} | {f.effort} | {f.confidence} | {f.priority_score} |"
        )
    if not roadmap:
        lines.append("| No initiatives provided | - | - | - | - |")

    lines.append("")
    lines.append("## Validation checklist")
    lines.append("- Confirm each finding has source evidence and timestamp.")
    lines.append("- Re-check indexability and canonicals post-deployment.")
    lines.append("- Measure CTR, rankings, and conversions after implementation.")

    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate SEO audit report from JSON input")
    parser.add_argument("--input", required=True, help="Path to input JSON")
    parser.add_argument("--output", required=True, help="Path to output markdown")
    args = parser.parse_args()

    in_path = Path(args.input)
    out_path = Path(args.output)

    payload = json.loads(in_path.read_text(encoding="utf-8"))
    report = build_report(payload)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(report, encoding="utf-8")
    print(f"Report generated: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
