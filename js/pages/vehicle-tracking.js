import { TRACKED_VEHICLES, DEFAULT_PLATE } from '../data.js';
import { createMap, addTrajectory } from '../components/map.js';

let mapInstance = null;
let currentMarkers = null;

export function render(params = {}) {
    const defaultSearch = params.plate || DEFAULT_PLATE;

    return `
        <div class="page vehicle-tracking-page page-enter">
            <!-- Search Bar -->
            <div class="panel mb-16">
                <div class="panel-body" style="padding: 14px 18px;">
                    <div class="input-group" style="display: flex; gap: 10px; align-items: center;">
                        <div style="position: relative; flex: 1;">
                            <svg style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary);" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                                <path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <input type="text" id="plateSearchInput" class="form-input" style="padding-left: 36px; font-family: 'SF Mono', 'Cascadia Code', 'Fira Code', monospace; font-size: 14px; font-weight: 600; letter-spacing: 0.05em;" placeholder="Enter license plate (e.g. WB 26 AE 7834)" value="${defaultSearch}">
                        </div>
                        <button id="trackVehicleBtn" class="btn btn-primary btn-lg" style="white-space: nowrap;">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="0.5" x2="8" y2="3.5" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="12.5" x2="8" y2="15.5" stroke="currentColor" stroke-width="1.5"/><line x1="0.5" y1="8" x2="3.5" y2="8" stroke="currentColor" stroke-width="1.5"/><line x1="12.5" y1="8" x2="15.5" y2="8" stroke="currentColor" stroke-width="1.5"/></svg>
                            TRACK VEHICLE
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading Skeleton -->
            <div id="loadingSkeleton" style="display: none;">
                <div class="metric-cards mb-16">
                    <div class="metric-card"><div class="skeleton skeleton-text" style="width: 60%; height: 12px; margin-bottom: 12px;"></div><div class="skeleton" style="width: 40%; height: 28px;"></div></div>
                    <div class="metric-card"><div class="skeleton skeleton-text" style="width: 60%; height: 12px; margin-bottom: 12px;"></div><div class="skeleton" style="width: 40%; height: 28px;"></div></div>
                    <div class="metric-card"><div class="skeleton skeleton-text" style="width: 60%; height: 12px; margin-bottom: 12px;"></div><div class="skeleton" style="width: 40%; height: 28px;"></div></div>
                    <div class="metric-card"><div class="skeleton skeleton-text" style="width: 60%; height: 12px; margin-bottom: 12px;"></div><div class="skeleton" style="width: 40%; height: 28px;"></div></div>
                </div>
                <div class="skeleton" style="height: 420px; border-radius: var(--radius-lg);"></div>
            </div>

            <!-- Results Container -->
            <div id="resultsContainer" style="display: none;">
                <!-- Metrics Row -->
                <div id="metricsRow" class="metric-cards mb-16"></div>

                <!-- Map + Detection Panel -->
                <div class="split-layout" style="align-items: start;">
                    <!-- Map Panel -->
                    <div class="panel" style="overflow: hidden;">
                        <div class="panel-header">
                            <span class="panel-title">Trajectory Map</span>
                            <span id="trajectoryPlate" class="badge badge-info" style="font-family: 'SF Mono', monospace; letter-spacing: 0.04em;"></span>
                        </div>
                        <div style="padding: 0;">
                            <div id="trackingMap" class="map-container" style="height: 480px; border-radius: 0;"></div>
                        </div>
                    </div>

                    <!-- Right Panel -->
                    <div style="display: flex; flex-direction: column; gap: 12px; max-height: 544px;">
                        <!-- Detection History -->
                        <div class="panel" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                            <div class="panel-header" style="flex-shrink: 0;">
                                <span class="panel-title">Detection History</span>
                                <span id="sightingCount" class="text-sm text-tertiary"></span>
                            </div>
                            <div class="panel-body scrollable" id="detectionHistoryList" style="flex: 1; overflow-y: auto; padding: 8px 14px;"></div>
                        </div>

                        <!-- Trajectory Validation -->
                        <div class="panel" style="flex-shrink: 0;">
                            <div class="panel-header">
                                <span class="panel-title">Trajectory Validation</span>
                            </div>
                            <div class="panel-body" style="padding: 10px 18px;">
                                <div id="trajectoryValidation"></div>
                                <div style="border-top: 1px solid var(--border); margin-top: 10px; padding-top: 12px; display: flex; align-items: center; justify-content: space-between;">
                                    <div>
                                        <div class="text-sm font-semibold" style="color: var(--text-primary);">Overall Confidence</div>
                                        <div class="text-xs text-tertiary">Trajectory reliability</div>
                                    </div>
                                    <div id="confidenceRingContainer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="empty-state" style="display: none;">
                <div class="empty-state-icon">🔍</div>
                <h3 class="empty-state-title">Vehicle Not Found</h3>
                <p class="empty-state-desc">No tracking data found for the specified license plate. Try one of the demo plates: WB 26 AE 7834, WB 14 CD 9021, or WB 02 BX 1456.</p>
            </div>
        </div>
    `;
}

export function init(params = {}) {
    const input = document.getElementById('plateSearchInput');
    const btn = document.getElementById('trackVehicleBtn');

    function performSearch(plateStr) {
        const plate = plateStr.trim().toUpperCase();
        if (!plate) return;

        // Show loading
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('loadingSkeleton').style.display = 'block';

        // Disable button during search
        btn.disabled = true;
        btn.style.opacity = '0.6';

        setTimeout(() => {
            document.getElementById('loadingSkeleton').style.display = 'none';
            btn.disabled = false;
            btn.style.opacity = '1';

            // Find vehicle (normalize spaces for matching)
            const vehicle = Object.values(TRACKED_VEHICLES).find(
                v => v.plate.replace(/\s/g, '') === plate.replace(/\s/g, '')
            );

            if (vehicle) {
                renderResults(vehicle);
            } else {
                document.getElementById('emptyState').style.display = 'flex';
            }
        }, 1200);
    }

    function renderResults(vehicle) {
        const container = document.getElementById('resultsContainer');
        container.style.display = 'block';

        // Plate badge
        document.getElementById('trajectoryPlate').textContent = vehicle.plate;

        // ===== Metrics =====
        document.getElementById('metricsRow').innerHTML = `
            <div class="metric-card">
                <div class="metric-icon blue">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 10.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" fill="currentColor"/></svg>
                </div>
                <div class="metric-label">Sightings</div>
                <div class="metric-value">${vehicle.metrics.sightings}</div>
                <div class="metric-change up" style="margin-top: 4px;">across ${vehicle.metrics.sightings} cameras</div>
            </div>
            <div class="metric-card">
                <div class="metric-icon green">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M9 5v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </div>
                <div class="metric-label">Duration</div>
                <div class="metric-value">${vehicle.metrics.duration}</div>
                <div class="text-xs text-tertiary" style="margin-top: 4px;">${vehicle.firstSeen?.split(',')[1]?.trim() || ''} — ${vehicle.lastSeen?.split(',')[1]?.trim() || ''}</div>
            </div>
            <div class="metric-card">
                <div class="metric-icon orange">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 13h2l1.5-3h7L14 13h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5" cy="13" r="1.5" stroke="currentColor" stroke-width="1.3"/><circle cx="13" cy="13" r="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5 10V7a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.5"/></svg>
                </div>
                <div class="metric-label">Avg Speed</div>
                <div class="metric-value">${vehicle.metrics.avgSpeed}<span class="metric-unit">km/h</span></div>
                <div class="text-xs text-tertiary" style="margin-top: 4px;">City speed limit: 50 km/h</div>
            </div>
            <div class="metric-card">
                <div class="metric-icon blue">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="9" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="9" r="1" fill="currentColor"/></svg>
                </div>
                <div class="metric-label">OCR Confidence</div>
                <div class="metric-value">${vehicle.metrics.ocrConfidence}<span class="metric-unit">%</span></div>
                <div class="metric-change up" style="margin-top: 4px;">High accuracy</div>
            </div>
        `;

        // ===== Map =====
        // Always create a fresh map — the old container is destroyed on navigation
        mapInstance = createMap('trackingMap', { center: [22.5726, 88.3639], zoom: 12 });

        if (vehicle.sightings && vehicle.sightings.length > 0) {
            const result = addTrajectory(mapInstance, vehicle.sightings, true);
            currentMarkers = result;
        }

        // ===== Detection History =====
        const historyList = document.getElementById('detectionHistoryList');
        document.getElementById('sightingCount').textContent = `${vehicle.sightings.length} detections`;

        historyList.innerHTML = `
            <ul class="detection-list">
                ${vehicle.sightings.map((s, i) => {
                    const confColor = s.confidence >= 96 ? 'var(--success)' : s.confidence >= 93 ? 'var(--warning)' : 'var(--danger)';
                    return `
                        <li class="detection-item" data-lat="${s.lat}" data-lng="${s.lng}" data-seq="${s.seq}" style="cursor: pointer;">
                            <div class="detection-marker">${String(s.seq).padStart(2, '0')}</div>
                            <div class="detection-info">
                                <div class="detection-camera">${s.camera}</div>
                                <div class="detection-location">${s.location}</div>
                                <div class="detection-time">${s.timestamp}</div>
                            </div>
                            <div style="text-align: right; flex-shrink: 0;">
                                <div class="detection-confidence" style="color: ${confColor};">${s.confidence}%</div>
                                <div class="confidence-bar" style="width: 52px; margin-top: 4px;">
                                    <div class="confidence-fill" style="width: ${s.confidence}%; background: ${confColor};"></div>
                                </div>
                            </div>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;

        // Click detection → zoom map
        historyList.querySelectorAll('.detection-item').forEach(item => {
            item.addEventListener('click', () => {
                const lat = parseFloat(item.dataset.lat);
                const lng = parseFloat(item.dataset.lng);

                // Highlight active detection
                historyList.querySelectorAll('.detection-item').forEach(el => {
                    el.style.background = '';
                });
                item.style.background = 'var(--accent-soft)';

                if (mapInstance && !isNaN(lat) && !isNaN(lng)) {
                    mapInstance.flyTo([lat, lng], 15, { duration: 0.8 });
                }
            });
        });

        // ===== Validation =====
        const checks = [
            { key: 'multiFrameOCR',     label: 'Multi-frame OCR fusion',  passed: vehicle.validation.multiFrameOCR },
            { key: 'plateConsistency',   label: 'Plate consistency check', passed: vehicle.validation.plateConsistency },
            { key: 'gpsProjection',      label: 'GPS projection match',   passed: vehicle.validation.gpsProjection },
            { key: 'speedPlausibility',  label: 'Speed plausibility',     passed: vehicle.validation.speedPlausibility },
        ];

        document.getElementById('trajectoryValidation').innerHTML = `
            <ul class="checklist">
                ${checks.map(c => `
                    <li class="checklist-item">
                        <div class="checklist-icon" style="background: ${c.passed ? 'var(--success-soft)' : 'var(--danger-soft)'}; color: ${c.passed ? 'var(--success)' : 'var(--danger)'};">
                            ${c.passed ? '✓' : '✗'}
                        </div>
                        <span style="color: var(--text-${c.passed ? 'secondary' : 'danger'});">${c.label}</span>
                        <span style="margin-left: auto; font-size: 11px; font-weight: 600; color: ${c.passed ? 'var(--success)' : 'var(--danger)'};">
                            ${c.passed ? 'PASS' : 'FAIL'}
                        </span>
                    </li>
                `).join('')}
            </ul>
        `;

        // ===== Confidence Ring =====
        const conf = vehicle.overallConfidence;
        const radius = 24;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - conf / 100);
        const ringColor = conf >= 90 ? 'var(--success)' : conf >= 75 ? 'var(--warning)' : 'var(--danger)';

        document.getElementById('confidenceRingContainer').innerHTML = `
            <div class="progress-ring" style="position: relative; width: 56px; height: 56px;">
                <svg width="56" height="56" style="transform: rotate(-90deg);">
                    <circle cx="28" cy="28" r="${radius}" fill="none" stroke="var(--border)" stroke-width="4"/>
                    <circle cx="28" cy="28" r="${radius}" fill="none" stroke="${ringColor}" stroke-width="4"
                        stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                        stroke-linecap="round" style="transition: stroke-dashoffset 1s ease;"/>
                </svg>
                <div class="progress-ring-text" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: var(--text-primary);">
                    ${conf}%
                </div>
            </div>
        `;
    }

    // Event listeners
    btn.addEventListener('click', () => {
        if (input.value.trim()) performSearch(input.value);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) performSearch(input.value);
    });

    // Auto-search on page load
    if (params.plate) {
        input.value = params.plate;
    }
    performSearch(input.value);
}
