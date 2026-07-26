# SensOS Developer Portal

Official documentation portal for the **SensOS** ecosystem.

**Site (planned):** [https://sensos.org](https://sensos.org)  
**Repository:** [github.com/GemminAI/sensos-docs](https://github.com/GemminAI/sensos-docs)

This repository is the Single Source of Truth (SSOT) for:

- RFC Series
- Architecture
- Developer Documentation
- Research
- Whitepapers
- API References
- Implementation Mapping
- Tutorials

It does **not** contain runtime implementation or product marketing.

## Audience

- Developers
- Researchers
- Reviewers
- Contributors

## Related repositories

| Repository | URL |
|---|---|
| SensOS Docs (this repo) | https://github.com/GemminAI/sensos-docs |
| NVS Runtime | https://github.com/GemminAI/nvs-runtime |

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Build

```bash
mkdocs build --strict
```

## CI

GitHub Actions builds the MkDocs site on every push and pull request.  
Deployment is intentionally **not** automated yet — review before publish.

## License

Copyright © Gemmina Intelligence LLC. — Pure Information Laboratory
