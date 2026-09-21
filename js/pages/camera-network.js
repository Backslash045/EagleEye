import { CAMERAS } from '../data.js';
import { createMap, addCameraMarkers, clearOverlays } from '../components/map.js';

export function render(params) {
    const camerasToShow = CAMERAS.slice(0, 48);
    
    let tableRows = '';
    camerasToShow.forEach(camera => {
        let badgeClass = 'badge-success';
        if (camera.status === 'offline') badgeClass = 'badge-danger';
        if (camera.status === 'degraded') badgeClass = 'badge-warning';
        
        tableRows += `
            <tr class="camera-row cursor-pointer hover:bg-gray-800 transition-colors border-b border-gray-800" data-id="${camera.id}" data-status="${camera.status}" data-lat="${camera.lat}" data-lng="${camera.lng}">
                <td class="p-3 font-mono text-sm text-white">${camera.id}</td>
                <td class="p-3 text-sm text-gray-300 truncate max-w-[150px]">${camera.name}</td>
                <td class="p-3 text-sm text-gray-400">${camera.zone}</td>
                <td class="p-3"><span class="badge ${badgeClass} text-xs uppercase">${camera.status}</span></td>
                <td class="p-3 text-sm text-right text-gray-300">${camera.uptime || '99.9'}%</td>
            </tr>
        `;
    });

    return `
        <div class="page page-camera-network h-full flex flex-col">
            <div class="page-header flex justify-between items-center mb-6">
                <div>
                    <h1 class="page-header-title text-2xl font-bold text-white">Camera Network</h1>
                    <p class="text-secondary text-sm mt-1">248 Online &bull; 5 Degraded &bull; 3 Offline</p>
                </div>
                <div class="filter-chips flex gap-2">
                    <button class="filter-chip active btn btn-sm btn-secondary" data-filter="all">All 256</button>
                    <button class="filter-chip btn btn-sm btn-secondary" data-filter="online">Online 248</button>
                    <button class="filter-chip btn btn-sm btn-secondary" data-filter="degraded">Degraded 5</button>
                    <button class="filter-chip btn btn-sm btn-secondary" data-filter="offline">Offline 3</button>
                </div>
            </div>

            <div class="split-layout flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
                <div class="w-full lg:w-2/3 card p-0 overflow-hidden flex flex-col relative">
                    <div id="networkMap" class="map-container map-lg w-full h-full flex-1"></div>
                </div>
                
                <div class="w-full lg:w-1/3 panel card flex flex-col h-full max-h-[600px] lg:max-h-none">
                    <div class="panel-header p-4 border-b border-gray-800">
                        <h2 class="panel-title font-bold text-white">Camera Directory</h2>
                    </div>
                    <div class="panel-body scrollable flex-1 overflow-y-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="sticky top-0 bg-gray-900 shadow">
                                <tr>
                                    <th class="p-3 text-xs uppercase tracking-wider text-gray-500 font-semibold cursor-pointer hover:text-white">ID</th>
                                    <th class="p-3 text-xs uppercase tracking-wider text-gray-500 font-semibold cursor-pointer hover:text-white">Location</th>
                                    <th class="p-3 text-xs uppercase tracking-wider text-gray-500 font-semibold cursor-pointer hover:text-white">Zone</th>
                                    <th class="p-3 text-xs uppercase tracking-wider text-gray-500 font-semibold cursor-pointer hover:text-white">Status</th>
                                    <th class="p-3 text-xs uppercase tracking-wider text-gray-500 font-semibold text-right cursor-pointer hover:text-white">Uptime %</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function init(params) {
    const camerasToShow = CAMERAS.slice(0, 48);
    
    // Initialize map
    // We assume default center is somewhere that makes sense if no points are there
    // but addCameraMarkers usually bounds to the points
    const map = createMap('networkMap', {
        center: [22.5726, 88.3639], // Kolkata center
        zoom: 12
    });
    
    let cameraMarkersLayer = addCameraMarkers(map, camerasToShow);
    
    // Interactions
    const filterChips = document.querySelectorAll('.filter-chip');
    const tableRows = document.querySelectorAll('.camera-row');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active', 'bg-gray-700'));
            chip.classList.add('active', 'bg-gray-700');
            
            const filter = chip.dataset.filter;
            let filteredCameras = [];
            
            tableRows.forEach(row => {
                const status = row.dataset.status;
                if (filter === 'all' || status === filter) {
                    row.style.display = '';
                    filteredCameras.push(camerasToShow.find(c => c.id === row.dataset.id));
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Re-draw map markers based on filtered data
            clearOverlays(cameraMarkersLayer);
            cameraMarkersLayer = addCameraMarkers(map, filteredCameras);
        });
    });

    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            const lat = parseFloat(row.dataset.lat);
            const lng = parseFloat(row.dataset.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
                
                // Highlight row
                tableRows.forEach(r => r.classList.remove('bg-gray-800'));
                row.classList.add('bg-gray-800');
            }
        });
    });
}
