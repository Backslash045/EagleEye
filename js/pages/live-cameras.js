import { CAMERAS } from '../data.js';

export function render(params) {
    const camerasToShow = CAMERAS.slice(0, 8);
    
    let gridHtml = '';
    camerasToShow.forEach(camera => {
        let badgeClass = 'badge-success';
        if (camera.status === 'offline') badgeClass = 'badge-danger';
        if (camera.status === 'degraded') badgeClass = 'badge-warning';
        
        const liveIndicator = camera.status === 'online' 
            ? `<div class="camera-live-indicator"><span class="camera-live-dot pulse"></span> LIVE</div>` 
            : '';

        gridHtml += `
            <div class="card camera-card" data-status="${camera.status}" data-id="${camera.id}">
                <div class="camera-feed relative" style="height: 200px; background: #1a1a24; border-radius: 8px 8px 0 0; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <div class="feed-pattern absolute inset-0 opacity-20" style="background-image: radial-gradient(#4a4a6a 1px, transparent 1px); background-size: 10px 10px;"></div>
                    <div class="feed-pattern-icon text-4xl opacity-50">📹</div>
                    <div class="camera-feed-overlay absolute inset-0" style="background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%);"></div>
                    <div class="camera-feed-label absolute bottom-3 left-3 text-white font-mono text-xs font-bold">${camera.id}</div>
                    ${liveIndicator}
                </div>
                <div class="camera-info p-4">
                    <div class="camera-name font-bold text-lg text-white mb-1">${camera.name}</div>
                    <div class="camera-location text-sm text-secondary mb-3">${camera.zone}</div>
                    <div class="camera-meta flex justify-between items-center text-xs">
                        <span class="badge ${badgeClass} uppercase">${camera.status}</span>
                        <span class="text-tertiary">${camera.lastDetection || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `;
    });

    return `
        <div class="page page-live-cameras">
            <div class="page-header flex justify-between items-center mb-6">
                <div>
                    <h1 class="page-header-title text-2xl font-bold text-white">Live Camera Feeds</h1>
                    <p class="text-secondary text-sm mt-1">248 cameras online</p>
                </div>
                <div class="filter-chips flex gap-2">
                    <button class="filter-chip active btn btn-sm btn-secondary" data-filter="all">All</button>
                    <button class="filter-chip btn btn-sm btn-secondary" data-filter="online">Online</button>
                    <button class="filter-chip btn btn-sm btn-secondary" data-filter="offline">Offline</button>
                </div>
            </div>

            <div class="camera-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${gridHtml}
            </div>

            <div id="cameraModal" class="modal-overlay fixed inset-0 bg-black/80 hidden items-center justify-center z-50">
                <div class="modal card w-full max-w-3xl border border-gray-700 bg-gray-900 shadow-xl overflow-hidden rounded-xl">
                    <div class="modal-header flex justify-between items-center p-4 border-b border-gray-800">
                        <h3 class="modal-title font-bold text-white" id="modalTitle">Camera Details</h3>
                        <button class="btn btn-ghost btn-sm close-modal text-gray-400 hover:text-white">&times;</button>
                    </div>
                    <div class="modal-body p-0">
                        <div class="camera-feed relative" style="height: 400px; background: #000; display: flex; align-items: center; justify-content: center;">
                            <div class="feed-pattern absolute inset-0 opacity-20" style="background-image: radial-gradient(#4a4a6a 1px, transparent 1px); background-size: 20px 20px;"></div>
                            <div class="feed-pattern-icon text-6xl opacity-40">📹</div>
                            <div class="camera-live-indicator absolute top-4 right-4 text-white bg-red-600/80 px-2 py-1 rounded text-xs flex items-center gap-2">
                                <span class="camera-live-dot pulse bg-white w-2 h-2 rounded-full"></span> LIVE
                            </div>
                        </div>
                        <div class="p-6 grid grid-cols-2 gap-6">
                            <div>
                                <h4 class="text-sm text-secondary font-bold mb-3 uppercase tracking-wider">Camera Info</h4>
                                <div class="grid grid-cols-2 gap-4 text-sm">
                                    <div class="text-tertiary">Zone</div><div class="text-white font-medium" id="modalZone"></div>
                                    <div class="text-tertiary">Status</div><div class="" id="modalStatus"></div>
                                    <div class="text-tertiary">Uptime</div><div class="text-white font-medium" id="modalUptime"></div>
                                    <div class="text-tertiary">Last Detection</div><div class="text-white font-medium" id="modalLastDet"></div>
                                </div>
                            </div>
                            <div>
                                <h4 class="text-sm text-secondary font-bold mb-3 uppercase tracking-wider">Recent Detections</h4>
                                <div class="detection-list flex flex-col gap-3 text-sm">
                                    <div class="flex justify-between items-center bg-gray-800 p-2 rounded">
                                        <span class="font-mono text-accent">MH 12 AB 1234</span>
                                        <span class="text-tertiary text-xs">2 min ago</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-gray-800 p-2 rounded">
                                        <span class="font-mono text-accent">KA 01 CD 5678</span>
                                        <span class="text-tertiary text-xs">5 min ago</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-gray-800 p-2 rounded">
                                        <span class="font-mono text-accent">DL 4C EF 9012</span>
                                        <span class="text-tertiary text-xs">12 min ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function init(params) {
    // Setup filter chips
    const filterChips = document.querySelectorAll('.filter-chip');
    const cameraCards = document.querySelectorAll('.camera-card');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active', 'bg-gray-700'));
            chip.classList.add('active', 'bg-gray-700');
            
            const filter = chip.dataset.filter;
            
            cameraCards.forEach(card => {
                if (filter === 'all' || card.dataset.status === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Modal interactions
    const modal = document.getElementById('cameraModal');
    const closeBtn = modal.querySelector('.close-modal');

    cameraCards.forEach(card => {
        card.addEventListener('click', () => {
            const camId = card.dataset.id;
            const camera = CAMERAS.find(c => c.id === camId);
            
            if (camera) {
                document.getElementById('modalTitle').textContent = `${camera.id} - ${camera.name}`;
                document.getElementById('modalZone').textContent = camera.zone;
                
                let badgeClass = 'badge-success';
                if (camera.status === 'offline') badgeClass = 'badge-danger';
                if (camera.status === 'degraded') badgeClass = 'badge-warning';
                
                document.getElementById('modalStatus').innerHTML = `<span class="badge ${badgeClass} uppercase">${camera.status}</span>`;
                document.getElementById('modalUptime').textContent = camera.uptime ? camera.uptime + '%' : '99.9%';
                document.getElementById('modalLastDet').textContent = camera.lastDetection || 'Just now';
                
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        });
        
        // Add subtle hover lift effect
        card.classList.add('transition-transform', 'duration-200', 'hover:-translate-y-1', 'cursor-pointer');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
}
