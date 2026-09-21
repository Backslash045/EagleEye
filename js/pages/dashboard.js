import { DASHBOARD, CAMERAS } from '../data.js';
import { createMap, addCameraMarkers } from '../components/map.js';

export function render(params = {}) {
    return `
        <div class="page dashboard-page">
            <div class="page-header mb-20">
                <h1 class="page-header-title">System Overview</h1>
            </div>
            
            <div class="metric-cards mb-20">
                <div class="metric-card">
                    <div class="metric-icon green">📷</div>
                    <div class="metric-label">Cameras Online</div>
                    <div class="flex items-center gap-8">
                        <div class="metric-value">${DASHBOARD.camerasOnline} / ${DASHBOARD.camerasTotal}</div>
                        <span class="badge badge-success metric-change up">+2 today</span>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon blue">🚗</div>
                    <div class="metric-label">Vehicles Tracked Today</div>
                    <div class="flex items-center gap-8">
                        <div class="metric-value">${DASHBOARD.vehiclesTracked.toLocaleString()}</div>
                        <span class="badge badge-info metric-change up">+1,247</span>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon red">🚨</div>
                    <div class="metric-label">Active Alerts</div>
                    <div class="flex items-center gap-8">
                        <div class="metric-value">${DASHBOARD.activeAlerts}</div>
                        <span class="badge badge-danger">5 critical</span>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon blue">🎯</div>
                    <div class="metric-label">Avg OCR Confidence</div>
                    <div class="metric-value">${DASHBOARD.avgOCRConfidence}%</div>
                </div>
            </div>

            <div class="split-layout-wide mb-20">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Network Overview</h2>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <div id="dashboardMap" class="map-container" style="height: 400px;"></div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Recent High-Interest Trajectories</h2>
                    </div>
                    <div class="card-body table-container" style="max-height: 400px; overflow-y: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr style="border-bottom: 1px solid #e5e7eb;">
                                    <th style="padding: 12px 8px;">Plate</th>
                                    <th style="padding: 12px 8px;">First Seen</th>
                                    <th style="padding: 12px 8px;">Last Seen</th>
                                    <th style="padding: 12px 8px;">Cameras</th>
                                    <th style="padding: 12px 8px;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${DASHBOARD.recentTrajectories.map(t => {
                                    let badgeClass = 'badge-neutral';
                                    if (t.status === 'Active') badgeClass = 'badge-success';
                                    else if (t.status === 'Flagged') badgeClass = 'badge-warning';
                                    else if (t.status === 'BOLO' || t.status === 'Wanted') badgeClass = 'badge-danger';
                                    
                                    return `
                                        <tr style="border-bottom: 1px solid #f3f4f6;">
                                            <td style="padding: 12px 8px;">
                                                <a href="#" class="trajectory-link mono text-primary font-medium" data-plate="${t.plate}" style="text-decoration: none;">${t.plate}</a>
                                            </td>
                                            <td style="padding: 12px 8px;" class="text-sm">${t.firstSeen}</td>
                                            <td style="padding: 12px 8px;" class="text-sm">${t.lastSeen}</td>
                                            <td style="padding: 12px 8px;">${t.cameras}</td>
                                            <td style="padding: 12px 8px;"><span class="badge ${badgeClass}">${t.status}</span></td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">System Health</h2>
                </div>
                <div class="card-body">
                    <div class="health-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
                        ${DASHBOARD.systemHealth.map(h => {
                            const statusColor = h.status === 'Operational' ? 'var(--success-color, #10b981)' : (h.status === 'Warning' ? 'var(--warning-color, #f59e0b)' : 'var(--danger-color, #ef4444)');
                            return `
                                <div class="health-card flex items-center gap-12" style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
                                    <div class="health-icon" style="font-size: 24px;">${h.icon || '🖥️'}</div>
                                    <div class="health-info">
                                        <div class="health-name font-medium">${h.name}</div>
                                        <div class="health-status text-sm" style="color: ${statusColor}; font-weight: 500;">${h.status}</div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function init(params = {}) {
    const map = createMap('dashboardMap', { center: [22.5726, 88.3639], zoom: 11 });
    addCameraMarkers(map, CAMERAS);

    document.querySelectorAll('.trajectory-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const plate = link.getAttribute('data-plate');
            if (window.navigateTo) {
                window.navigateTo('vehicle-tracking', { plate });
            }
        });
    });
}
