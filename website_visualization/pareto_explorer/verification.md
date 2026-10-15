# Verification record

Verified on 2026-10-15 using installed MATLAB R2024b Update 9 and headless Google Chrome.

## Scientific export

- 12 lake/fleet/configuration groups; 593 exported solutions.
- Every point passed saved feasibility and full-final-population strict nondominance checks before downselection.
- All three objectives were recomputed for every exported mission using its own saved boat waypoints and the original simulation logs.
- Maximum length discrepancy: 4.5474735088646412e-13 metres. Maximum density discrepancy: 0.
- MATLAB export completed successfully. See `data/validation_report.json`.
- `python3 verify_data.py` passed: no NaN/Inf, wrong dimensions, missing trajectories, sign mismatches, missing extremes, missing balanced points, dominated exported points, open shoreline boundaries or invalid raster lengths.

## Browser checks

- All 593 plot points across all 12 groups were selected through their event handlers. Each selection was checked against the selected highlight, tooltip, mission dropdown and summary. Every rendered cubic route coordinate was independently compared with that solution's exported control points under the map's transform.
- Physical mouse hover, arrow-key navigation and preset buttons passed.
- Touch selection passed at 390 × 844; responsive checks passed at widths 320, 390, 760, 1024 and 1440 px, without horizontal overflow or selector overlap.
- Reduced-motion test reported `0s` transitions.
- No browser JavaScript errors or external service requests. Only local HTML, CSS, JS and JSON were fetched; map images are created in memory.
- Browser ran after MATLAB had exited, using only the generated static files.
- Desktop, Campillo/three-boat and mobile screenshots were visually inspected. See `verification/desktop.png`, `verification/campillo.png`, `verification/mobile.png`; machine-readable output is `verification/results.json`.
- JavaScript syntax checks and whitespace checks passed.

The browser's exhaustive point-event check is supplemented by real pointer/keyboard/touch checks. Closely projected Pareto points can overlap in 2D; the mission dropdown and keyboard navigation reach every retained solution without moving its scientific coordinates.

## Deployable sizes

Gzip measurements use Python's `gzip.compress(..., mtime=0)`; actual GitHub Pages transfer encoding is controlled by hosting. No duplicate `.gz` copy is required.

| File | Bytes | Gzip bytes |
| --- | ---: | ---: |
| `index.html` | 6,063 | 2,404 |
| `styles.css` | 6,922 | 2,333 |
| `app.js` | 20,900 | 6,867 |
| `data/pareto_solutions.json` | 1,184,627 | 217,736 |
| **Total runtime files** | **1,218,512** | **229,340** |

The exporter, README, verification scripts, reports and screenshots are development artifacts and are not required at runtime. No original MAT file is loaded by the browser.

## Final presentation revision

Re-ran `verify_data.py` and `verify_browser.cjs` after the terminology and representative-count changes. All 12 groups / 593 point-to-trajectory checks passed, along with mouse, keyboard, touch, responsive widths and reduced-motion checks; no browser errors. The dedicated-page view and the framed view’s full-page launch link also passed.

Public wording now describes feasible nondominated missions found in the final population and labels the unchanged third-objective display as Cyanobacteria-density coverage. The recommended portfolio entry is a dedicated-page link.

Scientific data was not regenerated or edited. Before/after SHA-256 checks confirmed both data JSON files are byte-for-byte identical:

- `pareto_solutions.json`: `123f9fbbe4b309983361441807a8fa964b75990b0f13741383b33a65ae469446`
- `validation_report.json`: `859185e79914a283feef7389e38dfe963541010a3f422bc3dd3aa70e2eb2e2d9`
