# AI Agentic SEO Audit

This project now includes a **live runnable audit generator** that converts structured SEO findings into a prioritized markdown report.

## Run now

```bash
python app/audit_agent.py --input data/sample_audit_input.json --output output/report.md
```

Then open:

- `output/report.md`

## Input format

- `meta`: project metadata (client, domain, objective, date window)
- `findings`: list of issues with category, evidence, impact, effort, confidence, recommendation
- `url_statuses` (optional): list of checked URLs and status codes. Any `404` responses are automatically converted into a high-priority technical finding.

Priority score is computed as:

`(Impact × Confidence) ÷ Effort`
