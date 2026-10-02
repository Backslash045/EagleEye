import { useEffect, useState } from 'react';
import { TRAFFIC } from '../data';
import { createMap, addHeatmap, addBottlenecks } from '../components/map';
import { createLineChart, createHorizontalBarChart, destroyChart } from '../components/charts';

const ZONE_BOUNDS = {
    central:   { latMin: 22.535, latMax: 22.600, lngMin: 88.320, lngMax: 88.380 },
    east:      { latMin: 22.460, latMax: 22.610, lngMin: 88.375, lngMax: 88.500 },
    north:     { latMin: 22.595, latMax: 22.670, lngMin: 88.340, lngMax: 88.450 },
    south:     { latMin: 22.440, latMax: 22.540, lngMin: 88.330, lngMax: 88.400 },
    southwest: { latMin: 22.440, latMax: 22.540, lngMin: 88.280, lngMax: 88.335 },
};

const ZONE_CENTERS: Record<string, [number, number, number]> = {
    all:       [22.5726, 88.3639, 12],
    central:   [22.5650, 88.3500, 14],
    east:      [22.5550, 88.4100, 13],
    north:     [22.6200, 88.3900, 13],
    south:     [22.5000, 88.3600, 13],
    southwest: [22.4850, 88.3150, 13],
};

function classifyPoint(lat: number, lng: number) {
    for (const [zone, b] of Object.entries(ZONE_BOUNDS)) {
        if (lat >= b.latMin && lat <= b.latMax && lng >= b.lngMin && lng <= b.lngMax) return zone;
    }
    return 'other';
}

const CORRIDOR_ZONE: Record<string, string> = {
    'EM Bypass (North)':    'east',
    'EM Bypass (South)':    'east',
    'Park Street':          'central',
    'AJC Bose Road':        'central',
    'VIP Road':             'north',
    'Rashbehari Avenue':    'south',
    'Diamond Harbour Road': 'southwest',
    'BT Road':              'north',
};

const TIME_SCALE: Record<string, number> = { today: 1.0, '7d': 0.85, '30d': 0.78 };
const ZONE_VOL_SCALE: Record<string, number> = { all: 1.0, central: 1.3, east: 1.1, north: 0.85, south: 0.95, southwest: 0.7 };

export default function TrafficAnalytics() {
    const [activeZone, setActiveZone] = useState('all');
    const [activeTime, setActiveTime] = useState('today');

    useEffect(() => {
        // Map
        const [lat, lng, zoom] = ZONE_CENTERS[activeZone] || ZONE_CENTERS.all;
        const map = createMap('analyticsMap', { center: [lat, lng], zoom });

        if (map) {
            let points: any[] = TRAFFIC.heatmapPoints || [];
            if (activeZone !== 'all') {
                points = points.filter((p: any) => classifyPoint(p[0], p[1]) === activeZone);
            }

            const tScale = TIME_SCALE[activeTime] || 1.0;
            if (tScale !== 1.0) {
                points = points.map((p: any) => [p[0], p[1], p[2] * tScale]);
            }

            if (points.length > 0) {
                addHeatmap(map, points);
            }

            let bottlenecks = TRAFFIC.bottlenecks || [];
            if (activeZone !== 'all') {
                bottlenecks = bottlenecks.filter((b: any) => classifyPoint(b.lat, b.lng) === activeZone);
            }
            if (bottlenecks.length > 0) {
                addBottlenecks(map, bottlenecks);
            }

            const statsEl = document.getElementById('heatmapStats');
            if (statsEl) {
                const label = activeZone === 'all' ? 'All Zones' : activeZone.charAt(0).toUpperCase() + activeZone.slice(1);
                statsEl.textContent = `${label} · ${points.length} data points · ${bottlenecks.length} bottleneck${bottlenecks.length !== 1 ? 's' : ''}`;
            }
        }

        // Corridor Chart
        destroyChart('corridorChart');
        let corridors = TRAFFIC.corridors || [];
        if (activeZone !== 'all') {
            const filtered = corridors.filter(c => CORRIDOR_ZONE[c.name] === activeZone);
            if (filtered.length > 0) corridors = filtered;
        }

        const tScale = TIME_SCALE[activeTime] || 1.0;
        const cLabels = corridors.map(c => c.name);
        const cData = corridors.map(c => Math.round(c.avgSpeed * tScale));
        const cColors = corridors.map(c => {
            if (c.congestion === 'low') return '#22c55e';
            if (c.congestion === 'medium') return '#f59e0b';
            return '#ef4444';
        });

        createHorizontalBarChart('corridorChart', cLabels, cData, cColors, {
            label: 'Avg Speed (km/h)',
            max: 80,
            barThickness: corridors.length <= 3 ? 28 : 18,
        });

        // Volume Chart
        destroyChart('volumeChart');
        const zScale = ZONE_VOL_SCALE[activeZone] || 1.0;
        const volTScale = activeTime === '30d' ? 1.2 : activeTime === '7d' ? 1.1 : 1.0;
        const hourly = TRAFFIC.hourlyVolume || [];

        const vLabels = hourly.map(v => v.hour);
        const vData = hourly.map(v => Math.round(v.volume * zScale * volTScale));

        createLineChart('volumeChart', vLabels, vData, {
            label: 'Vehicle Count',
            color: '#3b82f6',
            fill: true,
            showPoints: false,
        });

    }, [activeZone, activeTime]);

    return (
        <div className="page page-enter">
            {/* Header */}
            <div className="page-header" style={{ marginBottom: '16px' }}>
                <h1 className="page-header-title">City Traffic Analytics</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div className="filter-chips">
                        {[
                            { id: 'all', label: 'All Zones' },
                            { id: 'central', label: 'Central' },
                            { id: 'east', label: 'East' },
                            { id: 'north', label: 'North' },
                            { id: 'south', label: 'South' },
                            { id: 'southwest', label: 'Southwest' }
                        ].map(z => (
                            <button 
                                key={z.id}
                                className={`filter-chip ${activeZone === z.id ? 'active' : ''}`}
                                onClick={() => setActiveZone(z.id)}
                            >
                                {z.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
                        {[
                            { id: 'today', label: 'Today' },
                            { id: '7d', label: '7 Days' },
                            { id: '30d', label: '30 Days' }
                        ].map(t => (
                            <button 
                                key={t.id}
                                className={`filter-chip ${activeTime === t.id ? 'active' : ''}`}
                                style={{ border: 'none', padding: '5px 14px' }}
                                onClick={() => setActiveTime(t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Heatmap Card */}
            <div className="panel" style={{ marginBottom: '16px', overflow: 'hidden' }}>
                <div className="panel-header">
                    <span className="panel-title">Congestion Heatmap & Bottlenecks</span>
                    <span id="heatmapStats" className="text-xs text-tertiary"></span>
                </div>
                <div id="analyticsMap" style={{ width: '100%', height: '420px' }}></div>
                <div style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border)' }}>
                    <span className="text-xs text-tertiary" style={{ flexShrink: 0 }}>Low</span>
                    <div style={{ flex: 1, maxWidth: '220px', height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444)' }}></div>
                    <span className="text-xs text-tertiary" style={{ flexShrink: 0 }}>High</span>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="panel">
                    <div className="panel-header">
                        <span className="panel-title">Average Speed by Corridor</span>
                    </div>
                    <div className="panel-body" style={{ padding: '12px 16px' }}>
                        <div style={{ position: 'relative', height: '260px' }}>
                            <canvas id="corridorChart"></canvas>
                        </div>
                    </div>
                </div>
                <div className="panel">
                    <div className="panel-header">
                        <span className="panel-title">Traffic Volume Over Time</span>
                    </div>
                    <div className="panel-body" style={{ padding: '12px 16px' }}>
                        <div style={{ position: 'relative', height: '260px' }}>
                            <canvas id="volumeChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            {/* OD Table */}
            <div className="panel">
                <div className="panel-header">
                    <span className="panel-title">Top Origin-Destination Flows</span>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Origin</th>
                                <th style={{ textAlign: 'center' }}>Flow</th>
                                <th>Destination</th>
                                <th>Daily Trips</th>
                                <th>Avg Travel Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(TRAFFIC.originDestination || []).map((od: any, idx: number) => (
                                <tr key={idx}>
                                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{od.origin}</td>
                                    <td style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--text-tertiary)' }}>→</td>
                                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{od.destination}</td>
                                    <td style={{ padding: '10px 14px' }}>{(od.trips || 0).toLocaleString()}</td>
                                    <td style={{ padding: '10px 14px' }}>{od.avgTime || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
