# D7 full-E2E first-run focus failure

- Candidate code: `684170d2b785b8ce834b1be86253f45d3f10e79c`.
- Full command: `AHEART_E2E_PORT=5306 corepack pnpm test:e2e -- --reporter=line`.
- Result: `622 passed / 127 existing platform skips / 1 failed`, 750 total.
- Only failure: desktop `q3-form-controls.spec.ts` visible Checkbox focus shadow returned `none` during the five-worker full run.
- The D7 and existing DnD native scenarios passed in that run.
- Immediate isolated rerun on production preview port 5307: `1 passed / 0 failed` without source or test changes.
- The isolated green result does not replace the full-suite gate. A full CI-shaped single-worker rerun is required and recorded separately before PR readiness.

## Final CI-shaped rerun

- Command: `CI=1 AHEART_E2E_PORT=5308 corepack pnpm test:e2e -- --reporter=line`.
- Result: `623 passed / 127 existing platform skips / 0 failed`, 750 total, 18.4 minutes.
- No source or Q3 test change was made between the first failure, the focused green rerun, and this full green rerun.
- This final run is the authoritative full-repository E2E gate for D7.
