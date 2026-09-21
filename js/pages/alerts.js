import { ALERTS } from '../data.js';

export function render(params) {
  const criticalCount = ALERTS.filter(a => a.severity === 'critical').length || 5;
  const warningCount = ALERTS.filter(a => a.severity === 'warning').length || 6;
  const infoCount = ALERTS.filter(a => a.severity === 'info').length || 4;
  const allCount = ALERTS.length || 15;

  return `
    <div class="page page-enter">
      <div class="page-header flex justify-between items-center mb-16">
        <h1 class="page-header-title text-2xl font-bold">Real-time Alert Feed</h1>
        <div class="flex items-center gap-16">
          <span class="text-danger font-medium text-sm">${criticalCount} critical alerts require attention</span>
          <div class="filter-chips flex gap-8" id="alertSeverityFilters">
            <button class="filter-chip active px-12 py-6 rounded-full bg-slate-100 text-sm font-medium flex items-center gap-8" data-severity="all">
              All <span class="badge badge-neutral bg-slate-200 px-6 py-2 rounded text-xs">${allCount}</span>
            </button>
            <button class="filter-chip px-12 py-6 rounded-full bg-white border border-slate-200 text-sm font-medium text-secondary hover:bg-slate-50 flex items-center gap-8" data-severity="critical">
              Critical <span class="badge badge-danger bg-red-100 text-red-700 px-6 py-2 rounded text-xs">${criticalCount}</span>
            </button>
            <button class="filter-chip px-12 py-6 rounded-full bg-white border border-slate-200 text-sm font-medium text-secondary hover:bg-slate-50 flex items-center gap-8" data-severity="warning">
              Warning <span class="badge badge-warning bg-orange-100 text-orange-700 px-6 py-2 rounded text-xs">${warningCount}</span>
            </button>
            <button class="filter-chip px-12 py-6 rounded-full bg-white border border-slate-200 text-sm font-medium text-secondary hover:bg-slate-50 flex items-center gap-8" data-severity="info">
              Info <span class="badge badge-info bg-blue-100 text-blue-700 px-6 py-2 rounded text-xs">${infoCount}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="alert-feed flex flex-col gap-12" id="alertFeedContainer">
        ${renderAlerts(ALERTS)}
      </div>
    </div>
  `;
}

function renderAlerts(alertsList) {
  if (!alertsList || alertsList.length === 0) {
    return `
      <div class="empty-state p-32 bg-white rounded-lg border border-slate-200 text-center text-secondary">
        <p class="empty-state-title font-medium">No alerts found</p>
      </div>
    `;
  }

  return alertsList.map((alert, index) => {
    // Add slideInRight animation to first two elements
    const animationClass = index < 2 ? 'page-enter' : '';
    
    let badgeStyle = 'bg-blue-100 text-blue-700'; // info
    let severityClass = 'info';
    
    if (alert.severity === 'critical') {
      badgeStyle = 'bg-red-100 text-red-700';
      severityClass = 'critical border-l-4 border-l-red-500';
    } else if (alert.severity === 'warning') {
      badgeStyle = 'bg-orange-100 text-orange-700';
      severityClass = 'warning border-l-4 border-l-orange-400';
    } else {
      severityClass = 'info border-l-4 border-l-blue-400';
    }

    return `
      <div class="alert-item ${severityClass} ${animationClass} bg-white border border-slate-200 rounded-lg p-16 flex justify-between items-center shadow-sm">
        <div class="alert-content flex-1">
          <div class="alert-header flex items-center gap-12 mb-8">
            <span class="alert-plate mono font-bold text-lg text-slate-900">${alert.plate}</span>
            <span class="badge ${badgeStyle} uppercase text-xs font-bold px-8 py-2 rounded">${alert.severity}</span>
          </div>
          <div class="alert-reason text-slate-800 font-medium mb-8">
            ${alert.reason}
          </div>
          <div class="alert-meta flex items-center gap-12 text-sm text-secondary">
            <span class="flex items-center gap-4">📷 ${alert.camera}</span>
            <span class="text-slate-300">&bull;</span>
            <span class="flex items-center gap-4">📍 ${alert.location}</span>
            <span class="text-slate-300">&bull;</span>
            <span class="flex items-center gap-4">🕒 ${alert.time || alert.timestamp}</span>
          </div>
        </div>
        <div class="alert-actions ml-16">
          ${alert.plate && alert.plate !== '—' 
            ? `<button class="btn btn-sm btn-secondary view-trajectory-btn px-12 py-6 bg-white border border-slate-300 rounded hover:bg-slate-50 text-sm font-medium" data-plate="${alert.plate}">View Trajectory</button>` 
            : ''}
        </div>
      </div>
    `;
  }).join('');
}

export function init(params) {
  const feedContainer = document.getElementById('alertFeedContainer');
  
  // Filter functionality
  const filtersContainer = document.getElementById('alertSeverityFilters');
  if (filtersContainer) {
    filtersContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;

      // Update active state
      document.querySelectorAll('#alertSeverityFilters .filter-chip').forEach(c => {
        c.classList.remove('active', 'bg-slate-100');
        c.classList.add('bg-white', 'text-secondary');
      });
      chip.classList.add('active', 'bg-slate-100');
      chip.classList.remove('bg-white', 'text-secondary');

      const severity = chip.dataset.severity;
      
      // Filter alerts
      const filteredAlerts = severity === 'all' 
        ? ALERTS 
        : ALERTS.filter(a => a.severity === severity);
        
      // Re-render feed
      feedContainer.innerHTML = renderAlerts(filteredAlerts);
      
      // Re-attach listeners to new buttons
      attachTrajectoryListeners();
    });
  }

  function attachTrajectoryListeners() {
    document.querySelectorAll('.view-trajectory-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const plate = e.target.dataset.plate;
        if (plate && window.navigateTo) {
          window.navigateTo('vehicle-tracking', { plate });
        }
      });
    });
  }

  attachTrajectoryListeners();
}
