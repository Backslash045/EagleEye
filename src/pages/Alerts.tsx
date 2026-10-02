import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALERTS } from '../data';

export default function Alerts() {
  const [filter, setFilter] = useState('all');

  const criticalCount = ALERTS.filter(a => a.severity === 'critical').length || 5;
  const warningCount = ALERTS.filter(a => a.severity === 'warning').length || 6;
  const infoCount = ALERTS.filter(a => a.severity === 'info').length || 4;
  const allCount = ALERTS.length || 15;

  const filteredAlerts = filter === 'all' 
    ? ALERTS 
    : ALERTS.filter(a => a.severity === filter);

  const navigate = useNavigate();

  const handleTrajectory = (plate: string) => {
    if (plate) {
      navigate(`/vehicle-tracking?plate=${plate}`);
    }
  };

  return (
    <div className="page page-enter">
      <div className="page-header flex justify-between items-center mb-16">
        <h1 className="page-header-title text-2xl font-bold">Real-time Alert Feed</h1>
        <div className="flex items-center gap-16">
          <span className="text-danger font-medium text-sm">{criticalCount} critical alerts require attention</span>
          <div className="filter-chips flex gap-8" id="alertSeverityFilters">
            <button 
              className={`filter-chip px-12 py-6 rounded-full text-sm font-medium flex items-center gap-8 ${filter === 'all' ? 'active bg-slate-100 text-slate-900' : 'bg-white border border-slate-200 text-secondary hover:bg-slate-50'}`} 
              onClick={() => setFilter('all')}
              data-severity="all"
            >
              All <span className="badge badge-neutral bg-slate-200 px-6 py-2 rounded text-xs">{allCount}</span>
            </button>
            <button 
              className={`filter-chip px-12 py-6 rounded-full text-sm font-medium flex items-center gap-8 ${filter === 'critical' ? 'active bg-slate-100 text-slate-900' : 'bg-white border border-slate-200 text-secondary hover:bg-slate-50'}`} 
              onClick={() => setFilter('critical')}
              data-severity="critical"
            >
              Critical <span className="badge badge-danger bg-red-100 text-red-700 px-6 py-2 rounded text-xs">{criticalCount}</span>
            </button>
            <button 
              className={`filter-chip px-12 py-6 rounded-full text-sm font-medium flex items-center gap-8 ${filter === 'warning' ? 'active bg-slate-100 text-slate-900' : 'bg-white border border-slate-200 text-secondary hover:bg-slate-50'}`} 
              onClick={() => setFilter('warning')}
              data-severity="warning"
            >
              Warning <span className="badge badge-warning bg-orange-100 text-orange-700 px-6 py-2 rounded text-xs">{warningCount}</span>
            </button>
            <button 
              className={`filter-chip px-12 py-6 rounded-full text-sm font-medium flex items-center gap-8 ${filter === 'info' ? 'active bg-slate-100 text-slate-900' : 'bg-white border border-slate-200 text-secondary hover:bg-slate-50'}`} 
              onClick={() => setFilter('info')}
              data-severity="info"
            >
              Info <span className="badge badge-info bg-blue-100 text-blue-700 px-6 py-2 rounded text-xs">{infoCount}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="alert-feed flex flex-col gap-12" id="alertFeedContainer">
        {filteredAlerts.length === 0 ? (
          <div className="empty-state p-32 bg-white rounded-lg border border-slate-200 text-center text-secondary">
            <p className="empty-state-title font-medium">No alerts found</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const animationClass = index < 2 ? 'page-enter' : '';
            let badgeStyle = 'bg-blue-100 text-blue-700';
            let severityClass = 'info border-l-4 border-l-blue-400';
            
            if (alert.severity === 'critical') {
              badgeStyle = 'bg-red-100 text-red-700';
              severityClass = 'critical border-l-4 border-l-red-500';
            } else if (alert.severity === 'warning') {
              badgeStyle = 'bg-orange-100 text-orange-700';
              severityClass = 'warning border-l-4 border-l-orange-400';
            }

            return (
              <div key={alert.id} className={`alert-item ${severityClass} ${animationClass} bg-white border border-slate-200 rounded-lg p-16 flex justify-between items-center shadow-sm`}>
                <div className="alert-content flex-1">
                  <div className="alert-header flex items-center gap-12 mb-8">
                    <span className="alert-plate mono font-bold text-lg text-slate-900">{alert.plate}</span>
                    <span className={`badge ${badgeStyle} uppercase text-xs font-bold px-8 py-2 rounded`}>{alert.severity}</span>
                  </div>
                  <div className="alert-reason text-slate-800 font-medium mb-8">
                    {alert.reason}
                  </div>
                  <div className="alert-meta flex items-center gap-12 text-sm text-secondary">
                    <span className="flex items-center gap-4">📷 {alert.camera}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="flex items-center gap-4">📍 {alert.location}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="flex items-center gap-4">🕒 {alert.time || alert.timestamp}</span>
                  </div>
                </div>
                <div className="alert-actions ml-16">
                  {alert.plate && alert.plate !== '—' && (
                    <button 
                      className="btn btn-sm btn-secondary view-trajectory-btn px-12 py-6 bg-white border border-slate-300 rounded hover:bg-slate-50 text-sm font-medium" 
                      data-plate={alert.plate}
                      onClick={() => handleTrajectory(alert.plate)}
                    >
                      View Trajectory
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
