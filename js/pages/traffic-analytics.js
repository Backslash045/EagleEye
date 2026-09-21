import { TRAFFIC } from '../data.js';
import { createMap, addHeatmap, addBottlenecks } from '../components/map.js';
import { createLineChart, createHorizontalBarChart, destroyChart } from '../components/charts.js';

/* ── Zone bounding boxes (approximate geographic regions of Kolkata) ── */
const ZONE_BOUNDS = {
    central:   { latMin: 22.535, latMax: 22.600, lngMin: 88.320, lngMax: 88.380 },
    east:      { latMin: 22.460, latMax: 22.610, lngMin: 88.375, lngMax: 88.500 },
    north:     { latMin: 22.595, latMax: 22.670, lngMin: 88.340, lngMax: 88.450 },
    south:     { latMin: 22.440, latMax: 22.540, lngMin: 88.330, lngMax: 88.400 },
    southwest: { latMin: 22.440, latMax: 22.540, lngMin: 88.280, lngMax: 88.335 },
};

const ZONE_CENTERS = {
    all:       [22.5726, 88.3639, 12],
    central:   [22.5650, 88.3500, 14],
    east:      [22.5550, 88.4100, 13],
    north:     [22.6200, 88.3900, 13],
    south:     [22.5000, 88.3600, 13],
    southwest: [22.4850, 88.3150, 13],
};

function classifyPoint(lat, lng) {
    for (const [zone, b] of Object.entries(ZONE_BOUNDS)) {
        if (lat >= b.latMin && lat <= b.latMax && lng >= b.lngMin && lng <= b.lngMax) return zone;
    }
    return 'other';
}

/* Corridor → zone mapping */
const CORRIDOR_ZONE = {
    'EM Bypass (North)':    'east',
    'EM Bypass (South)':    'east',
    'Park Street':          'central',
    'AJC Bose Road':        'central',
    'VIP Road':             'north',
    'Rashbehari Avenue':    'south',
    'Diamond Harbour Road': 'southwest',
    'BT Road':              'north',
};

/* Time multipliers: simulate 7d / 30d averages vs today */
const TIME_SCALE = { today: 1.0, '7d': 0.85, '30d': 0.78 };
const ZONE_VOL_SCALE = { all: 1.0, central: 1.3, east: 1.1, north: 0.85, south: 0.95, southwest: 0.7 };

/* ─────────────────── RENDER ─────────────────── */
export function render() {
    return `
    <div class="page page-enter">
        <!-- Header -->
        <div class="page-header" style="margin-bottom: 16px;">
            <h1 class="page-header-title">City Traffic Analytics</h1>
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                <div class="filter-chips" id="zoneFilters">
                    <button class="filter-chip active" data-zone="all">All Zones</button>
                    <button class="filter-chip" data-zone="central">Central</button>
                    <button class="filter-chip" data-zone="east">East</button>
                    <button class="filter-chip" data-zone="north">North</button>
                    <button class="filter-chip" data-zone="south">South</button>
                    <button class="filter-chip" data-zone="southwest">Southwest</button>
                </div>
                <div id="timeFilters" style="display: flex; gap: 2px; background: var(--bg-secondary); padding: 3px; border-radius: var(--radius-md);">
                    <button class="filter-chip active" data-time="today" style="border: none; padding: 5px 14px;">Today</button>
                    <button class="filter-chip" data-time="7d" style="border: none; padding: 5px 14px;">7 Days</button>
                    <button class="filter-chip" data-time="30d" style="border: none; padding: 5px 14px;">30 Days</button>
                </div>
            </div>
        </div>

        <!-- Heatmap Card -->
        <div class="panel" style="margin-bottom: 16px; overflow: hidden;">
            <div class="panel-header">
                <span class="panel-title">Congestion Heatmap & Bottlenecks</span>
                <span id="heatmapStats" class="text-xs text-tertiary"></span>
            </div>
            <div id="analyticsMap" style="width: 100%; height: 420px;"></div>
            <div style="padding: 8px 18px; display: flex; align-items: center; gap: 12px; border-top: 1px solid var(--border);">
                <span class="text-xs text-tertiary" style="flex-shrink: 0;">Low</span>
                <div style="flex: 1; max-width: 220px; height: 8px; border-radius: 4px; background: linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444);"></div>
                <span class="text-xs text-tertiary" style="flex-shrink: 0;">High</span>
            </div>
        </div>

        <!-- Charts Row -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div class="panel">
                <div class="panel-header">
                    <span class="panel-title">Average Speed by Corridor</span>
                </div>
                <div class="panel-body" style="padding: 12px 16px;">
                    <div style="position: relative; height: 260px;">
                        <canvas id="corridorChart"></canvas>
                    </div>
                </div>
            </div>
            <div class="panel">
                <div class="panel-header">
                    <span class="panel-title">Traffic Volume Over Time</span>
                </div>
                <div class="panel-body" style="padding: 12px 16px;">
                    <div style="position: relative; height: 260px;">
                        <canvas id="volumeChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- OD Table -->
        <div class="panel">
            <div class="panel-header">
                <span class="panel-title">Top Origin-Destination Flows</span>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Origin</th>
                            <th style="text-align: center;">Flow</th>
                            <th>Destination</th>
                            <th>Daily Trips</th>
                            <th>Avg Travel Time</th>
                        </tr>
                    </thead>
                    <tbody id="odTableBody"></tbody>
                </table>
            </div>
        </div>
    </div>`;
}

/* ─────────────────── INIT ─────────────────── */
export function init() {
    let activeZone = 'all';
    let activeTime = 'today';

    /* ── Refresh everything ── */
    function refresh() {
        refreshMap();
        refreshCorridorChart();
        refreshVolumeChart();
        refreshODTable();
    }

    /* ── MAP ── */
    function refreshMap() {
        const [lat, lng, zoom] = ZONE_CENTERS[activeZone] || ZONE_CENTERS.all;

        const map = createMap('analyticsMap', {
            center: [lat, lng],
            zoom: zoom,
        });

        if (!map) return;

        // Filter heatmap points by zone
        let points = TRAFFIC.heatmapPoints || [];
        if (activeZone !== 'all') {
            points = points.filter(p => classifyPoint(p[0], p[1]) === activeZone);
        }

        // Scale intensity by time range
        const tScale = TIME_SCALE[activeTime] || 1.0;
        if (tScale !== 1.0) {
            points = points.map(p => [p[0], p[1], p[2] * tScale]);
        }

        // Add heatmap
        if (points.length > 0) {
            addHeatmap(map, points);
        }

        // Filter & add bottlenecks
        let bottlenecks = TRAFFIC.bottlenecks || [];
        if (activeZone !== 'all') {
            bottlenecks = bottlenecks.filter(b => classifyPoint(b.lat, b.lng) === activeZone);
        }
        if (bottlenecks.length > 0) {
            addBottlenecks(map, bottlenecks);
        }

        // Update stats label
        const statsEl = document.getElementById('heatmapStats');
        if (statsEl) {
            const label = activeZone === 'all' ? 'All Zones' : activeZone.charAt(0).toUpperCase() + activeZone.slice(1);
            statsEl.textContent = `${label} · ${points.length} data points · ${bottlenecks.length} bottleneck${bottlenecks.length !== 1 ? 's' : ''}`;
        }
    }

    /* ── CORRIDOR CHART ── */
    function refreshCorridorChart() {
        // Destroy previous
        destroyChart('corridorChart');

        let corridors = TRAFFIC.corridors || [];
        if (activeZone !== 'all') {
            const filtered = corridors.filter(c => CORRIDOR_ZONE[c.name] === activeZone);
            if (filtered.length > 0) corridors = filtered;
        }

        const tScale = TIME_SCALE[activeTime] || 1.0;
        const labels = corridors.map(c => c.name);
        const data = corridors.map(c => Math.round(c.avgSpeed * tScale));
        const colors = corridors.map(c => {
            if (c.congestion === 'low') return '#22c55e';
            if (c.congestion === 'medium') return '#f59e0b';
            return '#ef4444';
        });

        createHorizontalBarChart('corridorChart', labels, data, colors, {
            label: 'Avg Speed (km/h)',
            max: 80,
            barThickness: corridors.length <= 3 ? 28 : 18,
        });
    }

    /* ── VOLUME CHART ── */
    function refreshVolumeChart() {
        destroyChart('volumeChart');

        const zScale = ZONE_VOL_SCALE[activeZone] || 1.0;
        const tScale = activeTime === '30d' ? 1.2 : activeTime === '7d' ? 1.1 : 1.0;
        const hourly = TRAFFIC.hourlyVolume || [];

        const labels = hourly.map(v => v.hour);
        const data = hourly.map(v => Math.round(v.volume * zScale * tScale));

        createLineChart('volumeChart', labels, data, {
            label: 'Vehicle Count',
            color: '#3b82f6',
            fill: true,
            showPoints: false,
        });
    }

    /* ── OD TABLE ── */
    function refreshODTable() {
        const tbody = document.getElementById('odTableBody');
        if (!tbody) return;

        const rows = TRAFFIC.originDestination || [];
        tbody.innerHTML = rows.map(od => `
            <tr>
                <td style="padding: 10px 14px; font-weight: 600;">${od.origin}</td>
                <td style="padding: 10px 14px; text-align: center; color: var(--text-tertiary);">→</td>
                <td style="padding: 10px 14px; font-weight: 600;">${od.destination}</td>
                <td style="padding: 10px 14px;">${(od.trips || 0).toLocaleString()}</td>
                <td style="padding: 10px 14px;">${od.avgTime || 'N/A'}</td>
            </tr>
        `).join('');
    }

    /* ── Zone filter clicks ── */
    document.querySelectorAll('#zoneFilters .filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#zoneFilters .filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeZone = btn.dataset.zone;
            refresh();
        });
    });

    /* ── Time filter clicks ── */
    document.querySelectorAll('#timeFilters .filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#timeFilters .filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTime = btn.dataset.time;
            refresh();
        });
    });

    /* ── Initial render ── */
    refresh();
}
