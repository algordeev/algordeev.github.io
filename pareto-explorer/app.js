/* Static, dependency-free viewer. All objective/trajectory matching happens at export. */
'use strict';
(() => {
  const { t } = window.explorerI18n;
  const lakeName = lake => t(lake.name);
  const NS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);
  const colours = ['var(--boat1)', 'var(--boat2)', 'var(--boat3)'];
  const isDark = () => document.documentElement.dataset.theme === 'dark';
  const state = { data: null, group: null, solution: null, pointNodes: new Map(), mapImages: new Map(), loadError: false };
  const number = (v, digits = 1) => new Intl.NumberFormat(window.explorerI18n.language, { maximumFractionDigits: digits }).format(v);
  const densityNumber = v => new Intl.NumberFormat(window.explorerI18n.language, v !== 0 && v < 0.0001
    ? { notation: 'scientific', maximumFractionDigits: 2, useGrouping: false }
    : { maximumSignificantDigits: 4, useGrouping: false }).format(v);
  function svgElement(tag, attrs = {}, text) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function append(parent, tag, attrs, text) { const node = svgElement(tag, attrs, text); parent.append(node); return node; }
  function options(select, rows) {
    select.replaceChildren(...rows.map(([value, label]) => {
      const option = document.createElement('option'); option.value = value; option.textContent = label; return option;
    }));
  }
  function normalizedObjectives(solution) {
    const { normalizationMin: lo, normalizationMax: hi } = state.group;
    return solution.objectives.map((v, i) => (v - lo[i]) / (hi[i] - lo[i] || 1));
  }
  function interpretSolution(solution) {
    if (solution.index === state.group.balancedIndex) return t('Balanced trade-off');
    const [time, length, collectionCost] = normalizedObjectives(solution);
    if (collectionCost <= .35 && (time >= .6 || length >= .6)) return t('Higher Cyanobacteria-density coverage with longer missions or routes');
    if (time <= .35 && collectionCost >= .6) return t('Faster mission with lower Cyanobacteria-density coverage');
    if (length <= .3 && collectionCost >= .6) return t('Shorter individual routes with lower Cyanobacteria-density coverage');
    if (time <= .35) return t('A trade-off favouring mission time');
    if (length <= .35) return t('A trade-off favouring shorter routes');
    if (collectionCost <= .35) return t('A trade-off favouring Cyanobacteria-density coverage');
    return t('A middle-ground trade-off across the three objectives');
  }
  function densityColour(fraction) {
    const stops = isDark()
      ? [[52, 90, 145], [57, 184, 187], [216, 240, 104]]
      : [[52, 90, 145], [25, 127, 131], [155, 121, 19]];
    const v = Math.max(0, Math.min(1, fraction)) * 2, i = Math.min(1, Math.floor(v)), t = v - i;
    return `rgb(${stops[i].map((a, k) => Math.round(a + (stops[i + 1][k] - a) * t)).join(',')})`;
  }
  function objectiveDescription(solution) {
    return t('Solution {index}: {time} minutes, {length} metres, {density} Cyanobacteria-density coverage in model units', {index: solution.index, time: number(solution.objectives[0] / 60), length: number(solution.objectives[1]), density: densityNumber(solution.densityContribution)});
  }
  function getPresetIndex(type) {
    if (type === 'balanced') return state.group.balancedIndex;
    const i = { time: 0, length: 1, density: 2 }[type];
    return state.group.solutions.reduce((best, s) => s.objectives[i] < best.objectives[i] ? s : best).index;
  }
  function selectSolution(index, showTooltip = false) {
    const solution = state.group.solutions.find(s => s.index === Number(index));
    if (!solution) throw new Error(`Missing solution ${index}`);
    state.solution = solution;
    state.pointNodes.forEach((node, id) => {
      const selected = id === solution.index;
      node.classList.toggle('selected', selected);
      node.setAttribute('aria-pressed', String(selected));
      node.setAttribute('tabindex', selected ? '0' : '-1');
      node.querySelector('.dot').setAttribute('r', selected ? '6.5' : '4.5');
      node.querySelector('.selected-halo').setAttribute('visibility', selected ? 'visible' : 'hidden');
    });
    $('mission').value = solution.index;
    document.querySelectorAll('[data-preset]').forEach(button => button.setAttribute('aria-pressed', String(solution.index === getPresetIndex(button.dataset.preset))));
    $('selection-label').textContent = solution.index === state.group.balancedIndex ? t('BALANCED SOLUTION') : t('SELECTED SOLUTION');
    $('interpretation').textContent = interpretSolution(solution);
    $('solution-tag').textContent = t('Solution {index}', {index: solution.index});
    setMetric('metric-time', number(solution.objectives[0] / 60), t('min'));
    setMetric('metric-length', number(solution.objectives[1]), t('m'));
    setMetric('metric-density', densityNumber(solution.densityContribution), t('model units'));
    $('selection-context').textContent = t('{fleet} ASVs · {lake} ({id}) · {config} · Repeat {repeat} · Generation {generation} · Solution {index} (MATLAB index)', {fleet: state.group.fleet, lake: lakeName(currentLake()), id: state.group.lake, config: state.group.configuration, repeat: state.group.repeat, generation: state.group.generation, index: solution.index});
    drawTrajectoryMap();
    $('tooltip').hidden = !showTooltip;
    if (showTooltip) updateTooltip(solution);
  }
  function setMetric(id, value, unit) { const small = document.createElement('small'); small.textContent = unit; $(id).replaceChildren(document.createTextNode(value), small); }
  function currentLake() { return state.data.lakes.find(l => l.id === state.group.lake); }
  function updateTooltip(solution) {
    const tooltip = $('tooltip');
    tooltip.replaceChildren();
    const strong = document.createElement('strong'); strong.textContent = t('Solution {index}', {index: solution.index});
    tooltip.append(strong);
    for (const text of [t('Time: {value} min', {value: number(solution.objectives[0] / 60)}), t('Longest path: {value} m', {value: number(solution.objectives[1])}), t('Cyanobacteria-density coverage: {value} model units', {value: densityNumber(solution.densityContribution)})]) {
      const line = document.createElement('div'); line.textContent = text; tooltip.append(line);
    }
    const node = state.pointNodes.get(solution.index), wrap = tooltip.parentElement;
    const x = Number(node.dataset.x) / 600 * wrap.clientWidth, y = Number(node.dataset.y) / 420 * wrap.clientHeight;
    tooltip.hidden = false;
    tooltip.style.left = `${Math.max(0, Math.min(wrap.clientWidth - tooltip.offsetWidth, x + 15))}px`;
    tooltip.style.top = `${Math.max(0, Math.min(wrap.clientHeight - tooltip.offsetHeight, y - tooltip.offsetHeight - 12))}px`;
  }
  function drawParetoFront() {
    const svg = $('front'); svg.replaceChildren(); state.pointNodes.clear();
    const { solutions, normalizationMin: lo, normalizationMax: hi } = state.group;
    const xMin = lo[0] / 60, xMax = hi[0] / 60, yMin = lo[1], yMax = hi[1];
    const dx = xMax - xMin || 1, dy = yMax - yMin || 1;
    const x = value => 78 + (value / 60 - xMin + dx * .06) / (dx * 1.12) * 492;
    const y = value => 350 - (value - yMin + dy * .06) / (dy * 1.12) * 305;
    for (let i = 0; i <= 4; i++) {
      const xv = xMin + dx * i / 4, yv = yMin + dy * i / 4;
      append(svg, 'line', { x1: 78, x2: 570, y1: y(yv), y2: y(yv), class: 'grid-line' });
      append(svg, 'line', { x1: x(xv * 60), x2: x(xv * 60), y1: 45, y2: 350, class: 'grid-line' });
      append(svg, 'text', { x: 66, y: y(yv) + 4, 'text-anchor': 'end' }, number(yv, 0));
      append(svg, 'text', { x: x(xv * 60), y: 373, 'text-anchor': 'middle' }, number(xv, 0));
    }
    append(svg, 'text', { x: 324, y: 408, 'text-anchor': 'middle', class: 'axis-label' }, t('Mission duration (min)'));
    append(svg, 'text', { transform: 'translate(7 200) rotate(-90)', 'text-anchor': 'middle', class: 'axis-label' }, t('Longest individual ASV path (m)'));
    const sorted = [...solutions].sort((a, b) => a.objectives[0] - b.objectives[0] || a.index - b.index);
    sorted.forEach((solution, position) => {
      const px = x(solution.objectives[0]), py = y(solution.objectives[1]);
      const node = append(svg, 'g', { class: 'point', role: 'button', tabindex: '-1', 'aria-label': objectiveDescription(solution), 'aria-pressed': 'false', 'data-index': solution.index, 'data-x': px, 'data-y': py });
      append(node, 'circle', { cx: px, cy: py, r: 12, class: 'hit' });
      append(node, 'circle', { cx: px, cy: py, r: 10.5, class: 'selected-halo', visibility: 'hidden' });
      const densityFraction = 1 - normalizedObjectives(solution)[2];
      append(node, 'circle', { cx: px, cy: py, r: 4.5, fill: densityColour(densityFraction), class: 'dot' });
      append(node, 'circle', { cx: px, cy: py, r: 14, class: 'focus-ring' });
      node.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') selectSolution(solution.index, true); });
      node.addEventListener('click', () => selectSolution(solution.index, true));
      node.addEventListener('focus', () => selectSolution(solution.index, true));
      node.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (position + 1) % sorted.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (position + sorted.length - 1) % sorted.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = sorted.length - 1;
        if (next !== undefined) { event.preventDefault(); state.pointNodes.get(sorted[next].index).focus(); }
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectSolution(solution.index, true); }
        if (event.key === 'Escape') $('tooltip').hidden = true;
      });
      state.pointNodes.set(solution.index, node);
    });
    $('density-min').textContent = t('{value} · Lower coverage', {value: densityNumber(-hi[2])});
    $('density-max').textContent = t('{value} · Greater coverage', {value: densityNumber(-lo[2])});
    $('point-count').textContent = t('{count} representative solutions from a front of {total}.', {count: solutions.length, total: state.group.frontCount});
    options($('mission'), sorted.map(s => [s.index, t('#{index} · {time} min · {length} m', {index: s.index, time: number(s.objectives[0] / 60), length: number(s.objectives[1], 0)})]));
  }
  function boundaryRings(boundary) {
    const adjacent = new Map(), key = p => p.join(',');
    for (const edge of boundary) {
      const a = edge.slice(0, 2), b = edge.slice(2);
      for (const [p, q] of [[a, b], [b, a]]) { const k = key(p); if (!adjacent.has(k)) adjacent.set(k, []); adjacent.get(k).push(q); }
    }
    const unused = new Set(adjacent.keys()), rings = [];
    while (unused.size) {
      const start = unused.values().next().value; let here = start, previous = null; const ring = [];
      do {
        const p = here.split(',').map(Number); ring.push(p); unused.delete(here);
        const neighbours = adjacent.get(here);
        if (neighbours.length !== 2) throw new Error('Lake boundary is not a closed manifold shoreline.');
        const next = neighbours.find(q => key(q) !== previous);
        previous = here; here = key(next);
        if (ring.length > boundary.length + 1) throw new Error('Unclosed boundary.');
      } while (here !== start);
      rings.push(ring);
    }
    return rings;
  }
  function mapDensityColour(fraction) {
    const value = Math.max(0, Math.min(1, fraction));
    if (!isDark()) {
      // MATLAB-inspired ramp: show the full scalar field without a gray wash.
      const stops = [[68, 35, 169], [49, 90, 245], [26, 199, 213], [85, 209, 93], [249, 239, 20]];
      const position = value * (stops.length - 1);
      const index = Math.min(stops.length - 2, Math.floor(position));
      const amount = position - index;
      return stops[index].map((channel, i) => Math.round(channel + (stops[index + 1][i] - channel) * amount));
    }
    const rgb = densityColour(value).match(/\d+/g).map(Number);
    const water = [21, 44, 60], opacity = .15 + .85 * value;
    return rgb.map((channel, i) => Math.round(water[i] * (1 - opacity) + channel * opacity));
  }
  function densityImage(lake) {
    const imageKey = `${lake.id}:${isDark() ? 'dark' : 'light'}`;
    if (state.mapImages.has(imageKey)) return state.mapImages.get(imageKey);
    const { width, height, values } = lake.density;
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const context = canvas.getContext('2d'), image = context.createImageData(width, height);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const value = values[y * width + x] / 255;
      const i = ((height - 1 - y) * width + x) * 4;
      image.data.set([...mapDensityColour(value), 255], i);
    }
    context.putImageData(image, 0, 0);
    const url = canvas.toDataURL(); state.mapImages.set(imageKey, url); return url;
  }
  function cubicPoint(start, segment, t) {
    const u = 1 - t;
    return [0, 1].map(i => u ** 3 * start[i] + 3 * u * u * t * segment[i] + 3 * u * t * t * segment[i + 2] + t ** 3 * segment[i + 4]);
  }
  function routeSamples(boat) {
    const samples = [boat.start]; let start = boat.start;
    for (const segment of boat.segments) { for (let i = 1; i <= 24; i++) samples.push(cubicPoint(start, segment, i / 24)); start = segment.slice(4); }
    return samples;
  }
  function drawTrajectoryMap() {
    const svg = $('map'); svg.replaceChildren();
    const lake = currentLake(), boats = state.solution.boats;
    const gradient = [0, .25, .5, .75, 1].map(value => `rgb(${mapDensityColour(value).join(',')}) ${value * 100}%`);
    $('map-density-range').parentElement.style.setProperty('--map-density-gradient', `linear-gradient(90deg, ${gradient.join(',')})`);
    const samples = boats.map(routeSamples);
    const points = [...lake.boundary.flatMap(s => [s.slice(0, 2), s.slice(2)]), ...samples.flat()];
    // Control hull bounds are conservative: no cubic route can be clipped.
    boats.forEach(b => b.segments.forEach(s => points.push(s.slice(0, 2), s.slice(2, 4), s.slice(4))));
    const lo = [0, 1].map(i => Math.min(...points.map(p => p[i]))), hi = [0, 1].map(i => Math.max(...points.map(p => p[i])));
    const scale = Math.min(540 / (hi[0] - lo[0] || 1), 350 / (hi[1] - lo[1] || 1));
    const centre = lo.map((v, i) => (v + hi[i]) / 2);
    const project = p => [300 + (p[0] - centre[0]) * scale, 202 - (p[1] - centre[1]) * scale];
    const pair = p => project(p).join(',');
    const d = boundaryRings(lake.boundary).map(ring => `M${ring.map(pair).join('L')}Z`).join('');
    const defs = append(svg, 'defs'); append(append(defs, 'clipPath', { id: 'lake-clip' }), 'path', { d, 'clip-rule': 'evenodd' });
    append(svg, 'path', { d, fill: 'var(--map-water)', 'fill-rule': 'evenodd' });
    const [xmin, ymin, xmax, ymax] = lake.bounds, corner = project([xmin, ymax]);
    append(svg, 'image', { href: densityImage(lake), x: corner[0], y: corner[1], width: (xmax - xmin) * scale, height: (ymax - ymin) * scale, preserveAspectRatio: 'none', 'clip-path': 'url(#lake-clip)' });
    append(svg, 'path', { d, fill: 'none', stroke: 'var(--map-shore)', 'stroke-width': 1.1 });
    const routePath = boat => `M${pair(boat.start)}` + boat.segments.map(s => `C${pair(s.slice(0, 2))} ${pair(s.slice(2, 4))} ${pair(s.slice(4))}`).join('');
    const paths = boats.map(routePath);
    // Differing dash patterns distinguish overlapping routes.
    boats.forEach((boat, b) => {
      const path = append(svg, 'path', { d: paths[b], fill: 'none', stroke: colours[b], 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': ['', '9 4', '2 4'][b], 'data-boat': b + 1 });
      append(path, 'title', {}, t('Boat {index}: {time} min, {length} m (3D)', {index: b + 1, time: number(boat.durationSeconds / 60), length: number(boat.lengthMetres)}));
      const pixel = samples[b].map(project), cumulative = [0];
      for (let i = 1; i < pixel.length; i++) cumulative.push(cumulative[i - 1] + Math.hypot(pixel[i][0] - pixel[i - 1][0], pixel[i][1] - pixel[i - 1][1]));
      for (const fraction of [.25, .5, .75]) {
        const j = cumulative.findIndex(v => v >= cumulative.at(-1) * fraction);
        if (j <= 0) continue;
        const [x, y] = pixel[j], prev = pixel[Math.max(0, j - 1)];
        const angle = Math.atan2(y - prev[1], x - prev[0]) * 180 / Math.PI;
        append(svg, 'path', { d: 'M-4,-3 L3,0 L-4,3', transform: `translate(${x},${y}) rotate(${angle})`, fill: 'none', stroke: 'var(--text)', 'stroke-width': 4 });
        append(svg, 'path', { d: 'M-4,-3 L3,0 L-4,3', transform: `translate(${x},${y}) rotate(${angle})`, fill: 'none', stroke: colours[b], 'stroke-width': 2 });
      }
      const a = project(boat.start), z = project(boat.destination);
      // Concentric sizes keep identical multi-boat endpoints visible.
      const r = 4 + (boats.length - 1 - b) * 2.5;
      append(svg, 'circle', { cx: a[0], cy: a[1], r, fill: 'var(--map-water)', stroke: colours[b], 'stroke-width': 1.8 });
      append(svg, 'path', { d: `M${z[0]},${z[1] - r - 2}l${r + 2},${r + 2}l${-r - 2},${r + 2}l${-r - 2},${-r - 2}Z`, fill: 'none', stroke: colours[b], 'stroke-width': 1.8 });
    });
    const target = 95 / scale, power = 10 ** Math.floor(Math.log10(target)), bar = [1, 2, 5, 10].map(v => v * power).filter(v => v <= target).at(-1);
    append(svg, 'path', { d: `M30 384v5h${bar * scale}v-5`, fill: 'none', stroke: 'var(--text)', 'stroke-width': 1.4 });
    append(svg, 'text', { x: 30, y: 407 }, t('{value} m', {value: number(bar, 0)}));
    append(svg, 'text', { x: 570, y: 407, 'text-anchor': 'end', 'font-size': 10 }, 'x →   y ↑');
    svg.setAttribute('aria-label', t('{lake}: solution {index}, {fleet} boat trajectories, complete lake boundary and mission-start density', {lake: lakeName(lake), index: state.solution.index, fleet: state.group.fleet}));
    svg.dataset.solutionIndex = state.solution.index;
    $('boat-legend').replaceChildren(...boats.map((_, i) => {
      const item = document.createElement('span'), swatch = document.createElement('span'); swatch.className = 'boat-swatch';
      swatch.style.background = i === 0 ? colours[i] : `repeating-linear-gradient(90deg,${colours[i]} 0 5px,transparent 5px 8px)`;
      item.append(swatch, t('Boat {index}', {index: i + 1})); return item;
    }));
    $('snapshot-note').textContent = t('Recorded bloom snapshot · simulation hour {hour}. The bloom moves during the mission; this background stays fixed for comparison.', {hour: number(lake.snapshotHour)});
    $('map-density-range').textContent = t('0–{value} model units', {value: densityNumber(lake.density.peak)});
  }
  function changeGroup(resetConfiguration = false) {
    const lake = $('lake').value, fleet = Number($('fleet').value);
    if (resetConfiguration) $('configuration').value = state.data.defaults.find(d => d.lake === lake && d.fleet === fleet).configuration;
    state.group = state.data.groups.find(g => g.lake === lake && g.fleet === fleet && g.configuration === $('configuration').value);
    if (!state.group) throw new Error('No dataset for this selection.');
    $('dataset-note').textContent = t('Median repeat {repeat} · Generation {generation}', {repeat: state.group.repeat, generation: state.group.generation});
    $('scenario-tag').textContent = `${lakeName(currentLake())} / ${lake}`;
    $('provenance').textContent = t('Source: {source} · final generation {generation} · {feasible}/{population} feasible · {front} nondominated · {exported} exported.', {source: state.group.source, generation: state.group.generation, feasible: state.group.feasibleCount, population: state.group.populationCount, front: state.group.frontCount, exported: state.group.solutions.length});
    drawParetoFront(); selectSolution(state.group.balancedIndex);
  }
  function validateDataset(data) {
    if (data.schemaVersion !== 1 || data.groups.length !== 12) throw new Error('Unsupported or incomplete dataset.');
    for (const group of data.groups) {
      if (!group.solutions.some(s => s.index === group.balancedIndex)) throw new Error('Missing balanced mission.');
      for (const s of group.solutions) {
        if (s.objectives.length !== 3 || !s.objectives.every(Number.isFinite) || s.restrictionMax > 0 || s.densityContribution !== -s.objectives[2] || s.boats.length !== group.fleet || s.boats.some(b => !b.segments.length || b.segments.some(c => c.length !== 6 || !c.every(Number.isFinite)))) throw new Error('Invalid mission data.');
      }
    }
  }
  async function loadDataset() {
    if (window.location.protocol === 'file:') {
      // Local files cannot fetch JSON; load the same exported data as a script.
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'data/pareto_solutions.js';
        script.onload = () => {
          const data = window.paretoExplorerData;
          delete window.paretoExplorerData;
          script.remove();
          if (data) resolve(data);
          else reject(new Error('Local dataset is missing.'));
        };
        script.onerror = () => {
          script.remove();
          reject(new Error('Could not load the local dataset.'));
        };
        document.head.append(script);
      });
    }
    const response = await fetch('data/pareto_solutions.json');
    if (!response.ok) throw new Error(`Dataset request returned ${response.status}.`);
    return response.json();
  }
  async function initialize() {
    $('full-page-link').hidden = window.self === window.top;
    try {
      state.data = await loadDataset(); validateDataset(state.data);
      options($('lake'), state.data.lakes.map(l => [l.id, `${lakeName(l)} / ${l.id}`]));
      options($('configuration'), [['A1R2C2', 'A1R2C2 · NSGA-II'], ['A2R3X1', 'A2R3X1 · NSGA-III'], ['A2R3X2', 'A2R3X2 · NSGA-III']]);
      $('lake').value = 'E2'; $('fleet').value = '2';
      $('lake').addEventListener('change', () => changeGroup(true)); $('fleet').addEventListener('change', () => changeGroup(true));
      $('configuration').addEventListener('change', () => changeGroup());
      $('mission').addEventListener('change', () => selectSolution($('mission').value));
      document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => selectSolution(getPresetIndex(button.dataset.preset))));
      $('front').addEventListener('pointerleave', () => { $('tooltip').hidden = true; });
      window.addEventListener('resize', () => { $('tooltip').hidden = true; });
      $('explorer').hidden = false; changeGroup(true); $('load-status').hidden = true;
    } catch (error) {
      state.loadError = true;
      $('explorer').hidden = true;
      $('load-status').textContent = t('Could not load the explorer. Please reload the page or try serving this folder over HTTP.');
      console.error(error);
    }
  }
  document.addEventListener('portfolio:theme', () => {
    if (!state.solution) return;
    const selected = state.solution.index;
    drawParetoFront();
    selectSolution(selected);
  });
  document.addEventListener('portfolio:language', () => {
    if (state.loadError) $('load-status').textContent = t('Could not load the explorer. Please reload the page or try serving this folder over HTTP.');
    if (!state.data || !state.group) return;
    const lake = $('lake').value, selected = state.solution.index;
    options($('lake'), state.data.lakes.map(l => [l.id, `${lakeName(l)} / ${l.id}`]));
    $('lake').value = lake;
    changeGroup();
    selectSolution(selected);
  });
  initialize();
})();
