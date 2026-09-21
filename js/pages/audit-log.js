import { AUDIT_LOG } from '../data.js';

export function render(params) {
    return `
    <div class="page">
        <!-- Top: Page header -->
        <div class="page-header flex justify-between items-center mb-20" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
                <h1 class="page-header-title text-2xl font-bold">Audit Log</h1>
                <p class="text-secondary mt-4">Access & activity records</p>
            </div>
            <div class="flex gap-12 items-center">
                <div class="input-group flex gap-8" style="display: flex; gap: 0.5rem; align-items: center;">
                    <input type="text" class="form-input" placeholder="Filter by date..." style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
                    <input type="text" id="plateFilterInput" class="form-input" placeholder="Filter by plate..." style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
                    <button id="filterBtn" class="btn btn-secondary btn-sm" style="padding: 0.5rem 1rem;">Filter</button>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="card border rounded bg-white shadow-sm">
            <div class="table-container" style="overflow-x: auto;">
                <table class="w-full text-left" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;">
                            <th class="p-12 text-sm font-semibold text-secondary" style="padding: 0.75rem;">Timestamp</th>
                            <th class="p-12 text-sm font-semibold text-secondary" style="padding: 0.75rem;">Operator</th>
                            <th class="p-12 text-sm font-semibold text-secondary" style="padding: 0.75rem;">Action</th>
                            <th class="p-12 text-sm font-semibold text-secondary" style="padding: 0.75rem;">Plate Number</th>
                            <th class="p-12 text-sm font-semibold text-secondary" style="padding: 0.75rem;">IP Address</th>
                            <th class="p-12 text-sm font-semibold text-secondary" style="padding: 0.75rem;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="auditTableBody">
                        <!-- rows injected via JS -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Bottom: Pagination -->
        <div class="flex justify-between items-center mt-20" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem;">
            <div class="text-sm text-secondary">Showing all records</div>
            <div class="pagination flex gap-8" style="display: flex; gap: 0.5rem;">
                <button class="page-btn active btn btn-sm btn-primary" style="padding: 0.25rem 0.75rem;">1</button>
                <button class="page-btn btn btn-sm btn-secondary" style="padding: 0.25rem 0.75rem;">2</button>
                <button class="page-btn btn btn-sm btn-secondary" style="padding: 0.25rem 0.75rem;">3</button>
                <button class="page-btn btn btn-sm btn-secondary" style="padding: 0.25rem 0.75rem;">Next</button>
            </div>
        </div>
    </div>
    `;
}

function getRoleBadge(role) {
    if (!role) return '';
    const r = role.toLowerCase();
    if (r === 'admin') return '<span class="badge badge-info text-xs">Admin</span>';
    if (r === 'analyst') return '<span class="badge badge-warning text-xs">Analyst</span>';
    return '<span class="badge badge-neutral text-xs">Viewer</span>';
}

function getStatusBadge(status) {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s === 'success' || s === 'granted' || s === 'active') return '<span class="badge badge-success text-xs">Success</span>';
    if (s === 'denied' || s === 'failed' || s === 'error') return '<span class="badge badge-danger text-xs">Denied</span>';
    return `<span class="badge badge-neutral text-xs">${status}</span>`;
}

function getActionHTML(action) {
    const a = (action || '').toLowerCase();
    let color = 'text-primary';
    if (a.includes('flag')) color = 'text-danger';
    if (a.includes('export')) color = 'text-success';
    if (a.includes('search')) color = 'text-info';
    return `<span class="font-medium ${color}">${action}</span>`;
}

export function init(params) {
    const tbody = document.getElementById('auditTableBody');
    const plateInput = document.getElementById('plateFilterInput');
    const filterBtn = document.getElementById('filterBtn');

    // Use AUDIT_LOG or generate mock data for 20 entries
    let data = AUDIT_LOG;
    if (!data || data.length === 0) {
        data = Array.from({length: 20}, (_, i) => ({
            id: `LOG-${1000+i}`,
            timestamp: new Date(Date.now() - (i * 3600000 + i * 150000)).toISOString().replace('T', ' ').substring(0, 19),
            operator: i % 3 === 0 ? 'Alice Smith' : (i % 2 === 0 ? 'Bob Jones' : 'Charlie Davis'),
            role: i % 3 === 0 ? 'Admin' : (i % 2 === 0 ? 'Analyst' : 'Viewer'),
            action: ['Search Vehicle', 'Export Data', 'Flag Vehicle', 'Unflag Vehicle', 'View Profile'][i % 5],
            plate: ['WB 26 AE 7834', 'MH 12 AB 1234', 'KA 01 XY 9999', 'DL 4C AB 4321', '-'][i % 5],
            ip: `192.168.1.${10+i}`,
            status: i % 7 === 0 ? 'Denied' : 'Success'
        }));
    } else {
        data = data.slice(0, 20); // Show max 20
    }

    const renderTable = (filterText = '') => {
        const filtered = data.filter(row => {
            if (!filterText) return true;
            return row.plate && row.plate.toLowerCase().includes(filterText.toLowerCase());
        });
        
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-20 text-center text-secondary" style="padding: 2rem;">No records found matching "${filterText}"</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(row => `
            <tr class="hover:bg-gray-50" style="border-bottom: 1px solid #f3f4f6; transition: background-color 0.2s;">
                <td class="p-12 text-sm text-secondary" style="padding: 0.75rem;">${row.timestamp || 'N/A'}</td>
                <td class="p-12" style="padding: 0.75rem;">
                    <div class="flex items-center gap-8" style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="font-medium">${row.operator || 'Unknown'}</span>
                        ${getRoleBadge(row.role)}
                    </div>
                </td>
                <td class="p-12" style="padding: 0.75rem;">${getActionHTML(row.action || 'Unknown')}</td>
                <td class="p-12 mono font-medium" style="padding: 0.75rem; font-family: monospace;">
                    ${row.plate !== '-' ? `<a href="#" class="text-primary hover:underline plate-link" data-plate="${row.plate}">${row.plate}</a>` : '-'}
                </td>
                <td class="p-12 mono text-tertiary text-sm" style="padding: 0.75rem; font-family: monospace;">${row.ip || '0.0.0.0'}</td>
                <td class="p-12" style="padding: 0.75rem;">${getStatusBadge(row.status)}</td>
            </tr>
        `).join('');

        // Attach click handlers to plate links to navigate
        const plateLinks = tbody.querySelectorAll('.plate-link');
        plateLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const plate = e.target.getAttribute('data-plate');
                if (plate && window.navigateTo) {
                    window.navigateTo('vehicle-tracking', { plate: plate });
                }
            });
        });
    };

    // Initial render
    renderTable();

    // Filters
    const handleFilter = () => {
        renderTable(plateInput.value.trim());
    };

    plateInput.addEventListener('input', handleFilter);
    filterBtn.addEventListener('click', handleFilter);
}
