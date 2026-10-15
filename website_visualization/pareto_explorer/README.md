# Multi-ASV Pareto Solution Explorer

A standalone, dependency-free HTML/CSS/JavaScript explorer of recorded Multi-ASV Planner results. It does not execute a planner, fabricate routes, or use external services. The existing portfolio and planner logic are unchanged.

## Generate the web data

Requires MATLAB R2024b (tested), the original Planner repository, and its existing `myFunctionsNSGAII.m` / `myFunctionsNSGAIII.m`. No optimisation, simulation, Statistics, or PDE Toolbox workflow is launched. `stlread`, triangulation boundary extraction, Java SHA-256 and the existing spline/density methods are used.

From MATLAB:

```matlab
addpath('/path/to/portfolio/website_visualization/pareto_explorer');
export_pareto_explorer_data('/path/to/Multi-ASV_Planner');
```

Exact command for the inspected local repositories:

```sh
/Applications/MATLAB_R2024b.app/bin/matlab -batch "addpath('/Users/macbookbro/algordeev.github.io/website_visualization/pareto_explorer'); export_pareto_explorer_data('/Users/macbookbro/Downloads/Multi-ASV_Planner');"
```

An optional second argument selects the output directory. The default is `data/` beside the exporter, irrespective of the working directory. The exporter reads Planner files and writes only its output directory. Expect several minutes: it recomputes density contribution for **every exported mission**, rather than only checking filenames or sample counts. The generated `data/validation_report.json` records actual numerical discrepancies.

## Verified source structure and definitions

Inspected the MAT files themselves with both SciPy and MATLAB, and read `optimNSGAII.m`, `optimNSGAIII.m`, `myFunctionsNSGAII.m`, `myFunctionsNSGAIII.m`, `optimPlots.m`, `Scripts/Launchers/Launcher.m`, `testMaps.m`, and `planner_analysis/compareFleetSizes.m`.

The statistical saves contain:

- `params`: saved planner settings, including fleet size, spline type, simulation/geometry references, Gaussian amplitude/widths, start hour, refinement and crossover settings.
- `logs.data{generation}{populationIndex}`: one element containing **its own** `objs` (three minimization objectives), `restr` (eight saved restriction values in these files), and `asv{boat}.x/y/z/t` waypoint arrays.
- `logs.HVE`, `logs.exeTime`, refinement metadata and machine information. The saved `logs.HVE` uses a different reference from the common-reference analysis report and is **not** used for repeat selection.

The final nonempty `logs.data` cell is used. Feasibility means all finite saved restrictions are `<= 0`. An explicit strict Pareto dominance test in all three **minimization** objectives removes any feasible point dominated by another final feasible point. Duplicated objective vectors are not treated as strict dominance.

| Stored objective | Verified mathematical definition | Display |
| --- | --- | --- |
| `objs(1)` | `max_j(t_j(end) - t_j(1))` | Minutes, obtained by dividing saved seconds by 60 |
| `objs(2)` | `max_j integral(norm([dx_j/dt,dy_j/dt,dz_j/dt]))` | Metres; longest individual **3D** route, not total fleet distance or horizontal map length |
| `objs(3)` | `-sum_i max_j rhoContr_j(i)` | **`densityContribution = -objs(3)`**, positive model contribution units |

`concentrInPath` evaluates each boat at `min(max(round(length),50),10000)` evenly spaced times. It uses the nearest recorded simulation time to `t/3600 + tStart`. The Gaussian for a particle is `A_i exp(-sum_d((x_d-p_id)^2/(2 sigma_d^2)))`. `rhoContr_j(i)` is that particle's maximum contribution across all samples along boat j; the fleet takes a maximum across boats before summing particles, avoiding repeated reward for overlap. Amplitudes for new particle IDs inherit their parents' amplitudes. The source function performs this logic during export validation.

This is neither a density time integral, instantaneous surface concentration, nor a count of collected cells. Existing plot headings such as “Integral of Particle Density” are not used as authoritative objective definitions. Both algorithm classes implement the same three objective definitions in the inspected code. Each group is plotted separately, with its own axes and normalization.

### Configuration and scenario identity

The launcher maps `A1` to NSGA-II and `A2` to NSGA-III. It maps `R2` to incremental refinement, `C2` to fixed refinement condition, `R3` to variable refinement, `X1` to random refinement crossover and `X2` to proportional refinement crossover. The exporter checks saved fleet size, spline type, simulation path, geometry path, refinement and relevant crossover/condition settings; it does not infer these from filenames alone. `refPtDiv` is also present in some A1 settings, so that field alone does not establish algorithm identity; algorithm labels also rely on the launcher's explicit A1/A2 mapping and experiment report.

- **E2 / Lake Mendota:** saved `params.geomSurfName = COMSOL/MendotaSurf.stl`, `params.simuSolName = Saves/Simulation/Sol-E2`, `tStart = 54` hours. Simulation logs have 3427 time snapshots and 1000 particle slots.
- **E4 / Lake Campillo:** saved `params.geomSurfName = COMSOL/Campillo3DSurf.stl`, `params.simuSolName = Saves/Simulation/Sol-E4`, `tStart = 47` hours. Simulation logs have 3001 snapshots and 1162 particle slots; `parentCell` contains 1459 IDs.

`xCellLog(time,particle,xyz)`, `IDLog(time,particle)`, `tVec` in hours, and `parentCell` are read from the simulation MAT files. Coordinates are the STL's saved metre coordinates, not inferred geographic coordinates. Endpoint positions come from each actual solution, not `testMaps.m`, whose E4 launcher endpoints differ from these saved experiments.

## Which fronts are included?

Use **median-repeat final fronts**, not pooled fronts. For each lake/fleet/configuration group, sort its five repeats by `FinalCommonHVE`, with repeat number breaking ties, and choose the middle repeat. Source: `img/Optimization/FleetSizeComparison/fleet_comparison_run_summary.csv`. That report uses a common reference box within each lake and exact three-dimensional hypervolume, documented in `planner_analysis/compareFleetSizes.m`. It is a front-level statistic only; no solution is assigned an HVE score.

All paths below are relative to `Saves/Optimization/Stat/`:

| Lake | ASVs | Configuration | Selected result file | Generation | Full feasible nondominated front | Exported |
| --- | ---: | --- | --- | ---: | ---: | ---: |
| E2 | 2 | A1R2C2 | `2ASV-A1E2R2C2-4.mat` | 200 | 100 | 50 |
| E2 | 2 | A2R3X1 | `2ASV-A2E2R3X1-3.mat` | 200 | 100 | 50 |
| E2 | 2 | A2R3X2 | `2ASV-A2E2R3X2-1.mat` | 200 | 100 | 50 |
| E2 | 3 | A1R2C2 | `3ASV-A1E2R2C2-5.mat` | 500 | 56 | 50 |
| E2 | 3 | A2R3X1 | `3ASV-A2E2R3X1-4.mat` | 500 | 100 | 50 |
| E2 | 3 | A2R3X2 | `3ASV-A2E2R3X2-4.mat` | 500 | 100 | 50 |
| E4 | 2 | A1R2C2 | `2ASV-A1E4R2C2-4.mat` | 200 | 100 | 50 |
| E4 | 2 | A2R3X1 | `2ASV-A2E4R3X1-4.mat` | 200 | 100 | 50 |
| E4 | 2 | A2R3X2 | `2ASV-A2E4R3X2-4.mat` | 200 | 100 | 50 |
| E4 | 3 | A1R2C2 | `3ASV-A1E4R2C2-1.mat` | 500 | 43 | 43 |
| E4 | 3 | A2R3X1 | `3ASV-A2E4R3X1-5.mat` | 500 | 100 | 50 |
| E4 | 3 | A2R3X2 | `3ASV-A2E4R3X2-2.mat` | 500 | 100 | 50 |

All 12 selected populations have 100 feasible final members, but not all members are nondominated. There are **593 exported missions**. Different final generation budgets mean this explorer is not a controlled test of two versus three boats.

### Representative points, balanced selection and defaults

Normalize each saved minimization objective to `[0,1]` using the **full feasible nondominated final front**. A constant objective contributes zero. The balanced solution minimizes Euclidean distance to `(0,0,0)` with equal weights; the first original population index breaks ties. It is a transparent compromise, not a mathematical curvature-based knee or universal optimum.

If a front exceeds 50 solutions, preserve the three minimizing extremes (minimum time, minimum longest path, minimum negative-density = maximum collection) and the balanced solution. Add points greedily by greatest distance to the nearest retained point in normalized 3D objective space. Original indices break ties; exported solutions return to original index order. The full front's normalization bounds are retained so interpretations and colors are not biased by the sample.

Interpretations use deterministic thresholds of these normalized objective positions, with the balanced index explicitly labelled. No AI or network request generates text. The app defaults to two ASVs, E2, and A2R3X2. For each lake/fleet, its default configuration is the one with the largest **mean final common-reference front HVE** across five repeats: A2R3X2 except E4/three ASVs, which defaults to A2R3X1. This is exploratory and does not establish statistical superiority.

## How trajectories stay attached to objectives

The exporter selects an original `logs.data{generation}{index}` element, retains its saved objective vector, and reconstructs **that element's own** boat splines using the source class's `spline_3D`. Local splines have zero endpoint speed and centered finite-difference interior derivatives (`splineLocal_1D`, `c=0`). It does not use the legacy single-ASV `recoverStatSaveElem` helper.

Every selected mission is validated by recomputing:

1. Fleet completion time from its waypoint time vectors.
2. Maximum individual 3D arc length with the source `lenInter` / `ppDer` functions.
3. Collected contribution by calling the source `concentrInPath` for every boat with the recorded simulation logs, then applying fleet maxima and the negative sum.

The export fails on a mismatch. The completed export had maximum arc-length discrepancy **4.5475e-13 m** and **zero density discrepancy**. Feasibility is the recorded restrictions, not a new physical constraint solver; we do not rerun collision or fluid constraints.

Each polynomial interval is exported as its **exact horizontal cubic Bézier controls**, start and destination. No trajectory coordinate downsampling or rounding is performed. For interval duration `h`, `C1=P0+h*v0/3`, `C2=P1-h*v1/3`, and the endpoint is `P1`. Browser SVG cubic commands preserve the curve exactly. A small sampled polyline positions directional arrows only; it does not draw or define the route. Depth influences validated path length and collection but the map is a plan projection.

Per-group provenance includes source file, SHA-256, repeat, generation, counts, full-front normalization bounds, balanced original index, and selected front-level HVE. Every solution has its original 1-based MATLAB population index, raw objective vector, per-boat metrics, saved maximum restriction and numerical validation errors. This group/index pairing identifies the original MAT element unambiguously. Lake geometry, simulation and report hashes are also recorded.

## Lake boundary and density background

`stlread` and triangulation `freeBoundary` extract **all** shoreline edges, including holes. The browser joins them into closed rings, uses even-odd clipping for density, and fits the entire lake plus the selected routes with one equal horizontal/vertical scale. Bounds conservatively include all Bézier control points, so curved routes cannot be clipped. No lake crop, cartographic reprojection or basemap is applied.

The raster is an **instantaneous horizontal Gaussian projection at `params.tStart`**, using the exact recorded particle coordinates and saved amplitude / x/y sigmas. It follows `gaussianSum` / `plotLakeDensity`'s horizontal projection, but intentionally uses one start snapshot instead of the latter function's time-average. The map explicitly labels the snapshot hour and explains that the bloom moves during the mission. It is distinct from the three-dimensional, time-dependent path collection score.

Grid width is 128, with height proportional to the lake's aspect ratio (minimum 32). Exact Gaussian sums are evaluated at grid nodes, quantized to 8 bits relative to a recorded peak in model units, and displayed with interpolation. Low values are darkened for contrast. The compact map approximates spatial density and is not used to compute any objective. A separate map legend reports the physical model-density range; the Pareto color legend reports collected contribution. Neither is calibrated concentration.

Boat colors remain blue, coral and lavender. Solid/dashed/dotted paths, dark halos, endpoint rings/diamonds and directional chevrons help distinguish close or overlapping routes. Exact overlaps can still partially occlude; no coordinates are displaced to manufacture separation.

## Preview, copy and embed

From this folder:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Or serve the portfolio root and open `/website_visualization/pareto_explorer/`. You can also open `index.html` directly from your computer. Local file previews load `data/pareto_solutions.js`; HTTP and GitHub Pages load the JSON dataset. The MATLAB exporter writes both versions from the same data.

To deploy, copy only:

```text
index.html
styles.css
lang.js
theme.js
app.js
data/pareto_solutions.json
data/pareto_solutions.js
```

Keep the exporter, this README, the verifier and validation reports for reproducibility, but the website does not need MATLAB, Python, the original MAT/STL files, npm packages, a CDN or a backend. Local file previews and offline static servers need no external network. It does not claim service-worker caching.

The recommended portfolio entry is a link to the dedicated, responsive full-page explorer:

```html
<a href="website_visualization/pareto_explorer/index.html"
   target="_blank" rel="noopener">Open the Pareto Solution Explorer ↗</a>
```

The explorer fills the available page width without a fixed height. Panels sit side by side above 760 px and stack below. No iframe is required. If an inline preview is also desired, an iframe can be used as an optional entry point; the explorer shows an “Open full-page explorer” link when framed. Keep the dedicated-page link available so visitors can explore without a fixed-height viewport. Styles remain scoped to this standalone document.

Keyboard: Tab reaches controls and the selected plot point; arrows move through missions ordered by duration; Home/End jump to the ends; Enter/Space select; Escape dismisses the tooltip. The native mission selector provides an alternative to small points and touch picking. Pointer hover, click and touch select update the point, map, metrics and tooltip together. Reduced-motion disables transitions; there is no looping animation.

## Verification

```sh
python3 verify_data.py
node --check app.js
```

The dependency-free verifier checks numeric finiteness, all groups, objective dimensions and density sign, saved feasibility, strict nondominance within exported groups, preserved extremes and balanced solution, boat counts, route segment shapes and endpoint agreement, stored duration/length consistency, validation errors, closed manifold shorelines, raster dimensions and provenance hashes. The MATLAB exporter additionally checks nondominance against the **entire final feasible population**, settings and spline knots, and reconstructs all three objectives against the real simulation.

The browser verification results and final file sizes are recorded in `verification.md`.

Optional browser regression test (development only): install `playwright-core` outside the deployed files, set `PARETO_PLAYWRIGHT_MODULE` to its absolute module directory, and run `node verify_browser.cjs`. Set `PARETO_CHROME_PATH` for a different installed Chrome executable, `PARETO_URL` for a different local preview URL, and `PARETO_ARTIFACT_DIR` for a different report/screenshot directory. Defaults assume the portfolio root is served on port 8000. The test checks all 593 point selections, verifies rendered cubic coordinates against each exported boat, and exercises hover, keyboard, presets, touch, responsive widths and reduced motion. No npm dependency is needed by the shipped application.

Public labels use “Cyanobacteria-density coverage” for the unchanged positive display of `-objs(3)`. “Feasible nondominated mission found in the final population” describes the saved result without implying global optimality. These presentation terms do not redefine the mathematical objective or change the data schema.

## Portfolio languages

The explorer supports English, Russian and Turkish, including chart labels, tooltips,
mission summaries and accessibility labels. Portfolio links pass `?lang=en|ru|tr`;
otherwise the page uses the portfolio’s saved `lang` preference, then the browser
language. Its language controls save the same preference. Switching language
preserves the selected lake, fleet, configuration and mission. The return link
opens the portfolio’s projects section in the selected language. Translations are
maintained in this folder’s `lang.js`; technical configuration identifiers and the
underlying exported scientific data remain unchanged.

## Portfolio appearance

The page loads `../../style.css` for the portfolio's fonts, color tokens, language
switcher and theme button; keep it at its current location within the portfolio.
Its local stylesheet supplies the chart layout and responsive rules. Both themes
use the portfolio's shared `theme` preference, follow system appearance until an
explicit selection, and sync theme changes between open tabs. Chart labels,
trajectories, tooltips and density backgrounds adapt without changing the selected
mission or the scientific values.
