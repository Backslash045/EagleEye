import { VEHICLE_INTELLIGENCE, DEFAULT_PLATE } from '../data.js';
import { createBarChart, createDoughnutChart } from '../components/charts.js';

export function render(params) {
    const plate = params?.plate || DEFAULT_PLATE;
    const vData = VEHICLE_INTELLIGENCE[plate] || VEHICLE_INTELLIGENCE[DEFAULT_PLATE] || {};
    
    const type = vData.vehicleType || 'Sedan';
    const color = vData.color || 'Silver';
    const make = vData.make || 'Maruti Ciaz';
    const firstSeen = vData.firstSeen || '02 Sep 2026';
    const lastSeen = vData.lastSeen || '14 Sep 2026';
    const totalSightings = vData.totalSightings || 142;

    return `
    <div class="page">
        <div class="page-header mb-20">
            <h1 class="page-header-title text-2xl font-bold">Vehicle Intelligence</h1>
        </div>

        <!-- Top: Vehicle profile header -->
        <div class="vehicle-profile-header card mb-20 p-20 border rounded">
            <div class="flex justify-between items-center w-full">
                <div>
                    <div class="vehicle-plate-display text-2xl font-bold mono mb-12 text-primary" style="font-size: 2rem;">${plate}</div>
                    <div class="vehicle-details-grid grid-2 gap-12 mt-12 text-sm" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                        <div class="vehicle-detail-item flex flex-col gap-4">
                            <span class="vehicle-detail-label text-secondary text-xs uppercase">Vehicle Type</span>
                            <span class="vehicle-detail-value font-medium">${type}</span>
                        </div>
                        <div class="vehicle-detail-item flex flex-col gap-4">
                            <span class="vehicle-detail-label text-secondary text-xs uppercase">Color</span>
                            <span class="vehicle-detail-value font-medium">${color}</span>
                        </div>
                        <div class="vehicle-detail-item flex flex-col gap-4">
                            <span class="vehicle-detail-label text-secondary text-xs uppercase">Make</span>
                            <span class="vehicle-detail-value font-medium">${make}</span>
                        </div>
                        <div class="vehicle-detail-item flex flex-col gap-4">
                            <span class="vehicle-detail-label text-secondary text-xs uppercase">First Seen</span>
                            <span class="vehicle-detail-value font-medium">${firstSeen}</span>
                        </div>
                        <div class="vehicle-detail-item flex flex-col gap-4">
                            <span class="vehicle-detail-label text-secondary text-xs uppercase">Last Seen</span>
                            <span class="vehicle-detail-value font-medium">${lastSeen}</span>
                        </div>
                        <div class="vehicle-detail-item flex flex-col gap-4">
                            <span class="vehicle-detail-label text-secondary text-xs uppercase">Total Sightings</span>
                            <span class="vehicle-detail-value font-bold text-accent">${totalSightings}</span>
                        </div>
                    </div>
                </div>
                <div class="action-bar flex flex-col gap-8">
                    <button id="flagBtn" class="btn btn-danger btn-sm">Flag Vehicle</button>
                    <button id="watchlistBtn" class="btn btn-secondary btn-sm">Add to Watchlist</button>
                </div>
            </div>
        </div>

        <!-- Below: grid-2 layout -->
        <div class="grid-2 gap-16 mb-20" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <!-- LEFT: Card Sighting Distribution by Zone -->
            <div class="card panel border rounded">
                <div class="card-header panel-header p-12 border-b">
                    <h3 class="card-title panel-title font-semibold">Sighting Distribution by Zone</h3>
                </div>
                <div class="card-body panel-body p-16 flex flex-col items-center">
                    <div class="chart-container w-full" style="height: 250px; position: relative;">
                        <canvas id="zoneChart"></canvas>
                    </div>
                    <div id="zoneLegend" class="mt-16 text-sm w-full"></div>
                </div>
            </div>

            <!-- RIGHT: Card Activity by Hour of Day -->
            <div class="card panel border rounded">
                <div class="card-header panel-header p-12 border-b">
                    <h3 class="card-title panel-title font-semibold">Activity by Hour of Day</h3>
                </div>
                <div class="card-body panel-body p-16">
                    <div class="chart-container w-full" style="height: 250px; position: relative;">
                        <canvas id="hourlyChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Below charts: two sections side by side -->
        <div class="grid-2 gap-16" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <!-- LEFT: Recent Alerts -->
            <div class="card panel border rounded">
                <div class="card-header panel-header p-12 border-b">
                    <h3 class="card-title panel-title font-semibold">Recent Alerts</h3>
                </div>
                <div class="card-body panel-body scrollable p-16" id="recentAlertsList" style="max-height: 300px; overflow-y: auto;">
                </div>
            </div>

            <!-- RIGHT: Common Routes -->
            <div class="card panel border rounded">
                <div class="card-header panel-header p-12 border-b">
                    <h3 class="card-title panel-title font-semibold">Common Routes</h3>
                </div>
                <div class="card-body panel-body scrollable p-16" style="max-height: 300px; overflow-y: auto;">
                    <ol class="list-decimal pl-20" id="commonRoutesList" style="list-style-type: decimal; padding-left: 1.5rem; line-height: 1.8;">
                    </ol>
                </div>
            </div>
        </div>
    </div>
    `;
}

export function init(params) {
    const plate = params?.plate || DEFAULT_PLATE;
    const vData = VEHICLE_INTELLIGENCE[plate] || VEHICLE_INTELLIGENCE[DEFAULT_PLATE] || {};

    // Buttons interaction
    const flagBtn = document.getElementById('flagBtn');
    if (flagBtn) {
        flagBtn.addEventListener('click', () => {
            if (flagBtn.classList.contains('btn-danger')) {
                flagBtn.classList.remove('btn-danger');
                flagBtn.classList.add('btn-secondary');
                flagBtn.textContent = 'Unflag Vehicle';
            } else {
                flagBtn.classList.remove('btn-secondary');
                flagBtn.classList.add('btn-danger');
                flagBtn.textContent = 'Flag Vehicle';
            }
        });
    }

    const watchlistBtn = document.getElementById('watchlistBtn');
    if (watchlistBtn) {
        watchlistBtn.addEventListener('click', () => {
            if (watchlistBtn.textContent === 'Add to Watchlist') {
                watchlistBtn.textContent = 'Remove from Watchlist';
            } else {
                watchlistBtn.textContent = 'Add to Watchlist';
            }
        });
    }

    // Zone Chart
    const zonesData = vData.zones || { 'North Zone': 45, 'South Zone': 30, 'East Zone': 15, 'West Zone': 25, 'Central Zone': 27 };
    const zoneLabels = Object.keys(zonesData);
    const zoneValues = Object.values(zonesData);
    const zoneColors = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#14b8a6'];
    
    setTimeout(() => {
        createDoughnutChart('zoneChart', zoneLabels, zoneValues, zoneColors, { cutout: '60%', showLegend: false });
    }, 100);
    
    // Zone Legend
    const zoneLegend = document.getElementById('zoneLegend');
    if (zoneLegend) {
        let legendHTML = '<div class="grid-2 gap-8" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">';
        zoneLabels.forEach((label, i) => {
            const color = zoneColors[i % zoneColors.length];
            legendHTML += `
                <div class="flex items-center gap-8" style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background-color:${color}"></span>
                    <span class="text-secondary">${label}</span>
                    <span class="font-medium ml-auto">${zoneValues[i]}</span>
                </div>
            `;
        });
        legendHTML += '</div>';
        zoneLegend.innerHTML = legendHTML;
    }

    // Hourly Chart
    const hourlyData = vData.hourlyPattern || [5,3,1,0,0,2,10,25,35,40,30,25,20,18,22,30,45,50,35,20,15,10,8,6];
    const hourlyLabels = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0') + ':00');
    
    setTimeout(() => {
        createBarChart('hourlyChart', hourlyLabels, hourlyData, { label: 'Activity by Hour', color: '#3b82f6' });
    }, 100);

    // Recent Alerts
    const alertsList = document.getElementById('recentAlertsList');
    if (alertsList) {
        const alerts = vData.alerts || [
            { severity: 'critical', reason: 'Speeding > 120km/h', time: '14:30' },
            { severity: 'warning', reason: 'Red Light Violation', time: '09:15' },
            { severity: 'info', reason: 'Unusual Route Detected', time: '08:45' }
        ];
        
        if (alerts.length === 0) {
            alertsList.innerHTML = '<div class="text-secondary text-sm">No recent alerts.</div>';
        } else {
            alertsList.innerHTML = alerts.map(a => {
                let badgeClass = 'badge-info';
                if (a.severity === 'critical') badgeClass = 'badge-danger';
                else if (a.severity === 'warning') badgeClass = 'badge-warning';

                return `
                    <div class="alert-item ${a.severity} mb-12 p-12 border rounded flex justify-between items-start" style="margin-bottom: 0.75rem; border: 1px solid var(--border-color, #e5e7eb); border-radius: 0.5rem; display: flex; justify-content: space-between;">
                        <div class="flex flex-col gap-4">
                            <span class="badge ${badgeClass} text-xs uppercase" style="align-self: flex-start;">${a.severity}</span>
                            <span class="font-medium mt-4">${a.reason}</span>
                        </div>
                        <span class="text-secondary text-sm">${a.time}</span>
                    </div>
                `;
            }).join('');
        }
    }

    // Common Routes
    const routesList = document.getElementById('commonRoutesList');
    if (routesList) {
        const routes = vData.recentRoutes || [
            'North Toll -> Main Intersection -> South Exit',
            'East Gate -> Commercial Street -> Downtown',
            'Downtown -> West Blvd -> North Toll'
        ];
        
        if (routes.length === 0) {
            routesList.parentElement.innerHTML = '<div class="text-secondary text-sm">No common routes data.</div>';
        } else {
            routesList.innerHTML = routes.map(r => `
                <li class="mb-12" style="margin-bottom: 0.75rem;">
                    <span class="font-medium text-secondary">
                        ${r.split('->').join('<span class="text-primary mx-4"> &rarr; </span>')}
                    </span>
                </li>
            `).join('');
        }
    }
}
