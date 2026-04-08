# AI Agentic SEO Audit Blueprint

This guide gives you a practical framework to run an **AI-assisted, agentic SEO audit** and produce an accurate report that teams can act on quickly.

## 1) Define the audit mission

Before running tools, define:

- **Primary goal:** traffic growth, lead quality, revenue pages, local visibility, etc.
- **Scope:** full site vs. section (`/blog`, `/docs`, `/shop`).
- **Market:** country/language/device.
- **KPIs:** indexed pages, clicks, impressions, rank distribution, conversions.

## 2) Agent roles (multi-agent setup)

Use specialized agents instead of one general assistant.

1. **Crawler Agent**
   - Collects URL inventory, status codes, canonicals, hreflang, robots directives.
2. **Technical Agent**
   - Checks indexability, structured data, Core Web Vitals proxies, rendering risks.
3. **Content Agent**
   - Scores intent match, topical coverage, duplication, thin pages, freshness.
4. **SERP/Competitor Agent**
   - Compares top competitors by query cluster and content format.
5. **Entity & Internal Linking Agent**
   - Maps entities, hub/spoke gaps, orphan pages, anchor quality.
6. **Prioritization Agent**
   - Converts findings into a prioritized roadmap by impact x effort x confidence.

## 3) Data sources to feed the agents

Minimum reliable stack:

- Crawl export (Screaming Frog/Sitebulb/custom crawler)
- Google Search Console exports (queries/pages)
- GA4 landing page performance
- XML sitemap(s)
- Backlink snapshot (optional but useful)
- Top competitor URLs for your core keyword clusters

## 4) Standard operating workflow

1. **Ingest & normalize data** into a single table keyed by canonical URL.
2. **Run technical checks** (indexability, canonical loops, redirect chains, noindex mismatch).
3. **Run content checks** (intent fit, uniqueness, E-E-A-T signal gaps, thin content).
4. **Run SERP gap analysis** by keyword cluster.
5. **Score each issue** with:
   - Impact (1-5)
   - Effort (1-5)
   - Confidence (1-5)
   - Priority score = `(Impact * Confidence) / Effort`
6. **Draft action plan** with owners, deadlines, and validation metrics.

## 5) Quality controls for accuracy

To keep the report accurate and avoid hallucinations:

- Require evidence fields for every finding (`source`, `url`, `metric`, `timestamp`).
- Disallow claims without raw row references.
- Separate **observations** from **inferences**.
- Add a confidence label: High / Medium / Low.
- Keep a change log per audit run.

## 6) Output package

Produce these artifacts each run:

- **Executive summary** (1 page)
- **Detailed findings** (technical/content/authority/internal links)
- **90-day roadmap** (quick wins + strategic projects)
- **Measurement plan** (how success is verified)

Use the template in `templates/agentic_seo_audit_report.md`.

## 7) Suggested cadence

- Weekly: KPI pulse + critical issue scan
- Monthly: full technical + content quality review
- Quarterly: strategy refresh, competitor re-baseline, information architecture decisions
