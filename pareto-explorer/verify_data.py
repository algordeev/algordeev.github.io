#!/usr/bin/env python3
"""Dependency-free validation of the shipped web dataset (not a MAT replacement)."""
import gzip
import json
import math
from pathlib import Path

HERE = Path(__file__).resolve().parent
path = HERE / 'data/pareto_solutions.json'
data = json.loads(path.read_text())

def finite(value):
    if isinstance(value, float):
        assert math.isfinite(value)
    elif isinstance(value, list):
        for item in value:
            finite(item)
    elif isinstance(value, dict):
        for item in value.values():
            finite(item)

finite(data)
assert len(data['groups']) == 12
assert len({(g['lake'], g['fleet'], g['configuration']) for g in data['groups']}) == 12
count = 0
for g in data['groups']:
    assert g['generation'] == (200 if g['fleet'] == 2 else 500)
    solutions = g['solutions']
    assert 1 <= len(solutions) <= 50
    assert len({s['index'] for s in solutions}) == len(solutions)
    assert any(s['index'] == g['balancedIndex'] for s in solutions)
    assert g['feasibleCount'] <= g['populationCount']
    assert len(solutions) <= g['frontCount'] <= g['feasibleCount']
    assert len(g['sourceSha256']) == 64
    for axis in range(3):
        assert min(s['objectives'][axis] for s in solutions) == g['normalizationMin'][axis], 'Missing extreme'
    for s in solutions:
        assert s['restrictionMax'] <= 0
        assert s['objectives'][2] <= 0
        assert s['densityContribution'] == -s['objectives'][2]
        assert len(s['boats']) == g['fleet']
        assert not any(all(a <= b for a, b in zip(other['objectives'], s['objectives'])) and any(a < b for a, b in zip(other['objectives'], s['objectives'])) for other in solutions)
        assert abs(max(b['durationSeconds'] for b in s['boats']) - s['objectives'][0]) < 1e-7
        assert abs(max(b['lengthMetres'] for b in s['boats']) - s['objectives'][1]) < max(1e-5, s['objectives'][1] * 1e-7)
        assert max(abs(v) for v in s['validationError']) < 1e-5
        for boat in s['boats']:
            assert len(boat['start']) == len(boat['destination']) == 2
            assert boat['segments'] and all(len(c) == 6 for c in boat['segments'])
            assert boat['segments'][-1][4:] == boat['destination']
        count += 1
for lake in data['lakes']:
    raster = lake['density']
    assert len(raster['values']) == raster['width'] * raster['height']
    assert min(raster['values']) >= 0 and max(raster['values']) == 255
    assert raster['peak'] > 0
    adjacency = {}
    for edge in lake['boundary']:
        assert len(edge) == 4
        for point in [tuple(edge[:2]), tuple(edge[2:])]:
            adjacency[point] = adjacency.get(point, 0) + 1
    assert all(degree == 2 for degree in adjacency.values()), 'Open or nonmanifold boundary'
    assert len(lake['geometrySha256']) == len(lake['simulationSha256']) == 64
result = {'groups': len(data['groups']), 'solutions': count, 'json_bytes': path.stat().st_size, 'gzip_bytes': len(gzip.compress(path.read_bytes(), mtime=0))}
print(json.dumps(result, indent=2))
