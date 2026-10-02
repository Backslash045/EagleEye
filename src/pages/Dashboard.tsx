import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD, CAMERAS } from '../data';
// @ts-ignore
import { createMap, addCameraMarkers } from '../components/map';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const map = createMap('dashboardMap', { center: [22.5726, 88.3639], zoom: 11 });
        if (map) {
            addCameraMarkers(map, CAMERAS);
        }
    }, []);

    const handleTrajectoryClick = (e: React.MouseEvent<HTMLAnchorElement>, plate: string) => {
        e.preventDefault();
        navigate(`/vehicle-tracking?plate=${plate}`);
    };

    return (
        <div className="page dashboard-page">
            <div className="page-header mb-20">
                <h1 className="page-header-title">System Overview</h1>
            </div>
            
            <div className="metric-cards mb-20">
                <div className="metric-card">
                    <div className="metric-icon green">📷</div>
                    <div className="metric-label">Cameras Online</div>
                    <div className="flex items-center gap-8">
                        <div className="metric-value">{DASHBOARD.camerasOnline} / {DASHBOARD.camerasTotal}</div>
                        <span className="badge badge-success metric-change up">+2 today</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon blue">🚗</div>
                    <div className="metric-label">Vehicles Tracked Today</div>
                    <div className="flex items-center gap-8">
                        <div className="metric-value">{DASHBOARD.vehiclesTracked.toLocaleString()}</div>
                        <span className="badge badge-info metric-change up">+1,247</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon red">🚨</div>
                    <div className="metric-label">Active Alerts</div>
                    <div className="flex items-center gap-8">
                        <div className="metric-value">{DASHBOARD.activeAlerts}</div>
                        <span className="badge badge-danger">5 critical</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon blue">🎯</div>
                    <div className="metric-label">Avg OCR Confidence</div>
                    <div className="metric-value">{DASHBOARD.avgOCRConfidence}%</div>
                </div>
            </div>

            <div className="split-layout-wide mb-20">
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Network Overview</h2>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <div id="dashboardMap" className="map-container" style={{ height: '400px' }}></div>
                    </div>
                </div>
                
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Recent High-Interest Trajectories</h2>
                    </div>
                    <div className="card-body table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <th style={{ padding: '12px 8px' }}>Plate</th>
                                    <th style={{ padding: '12px 8px' }}>First Seen</th>
                                    <th style={{ padding: '12px 8px' }}>Last Seen</th>
                                    <th style={{ padding: '12px 8px' }}>Cameras</th>
                                    <th style={{ padding: '12px 8px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {DASHBOARD.recentTrajectories.map((t, idx) => {
                                    let badgeClass = 'badge-neutral';
                                    if (t.status === 'Active') badgeClass = 'badge-success';
                                    else if (t.status === 'Flagged') badgeClass = 'badge-warning';
                                    else if (t.status === 'BOLO' || t.status === 'Wanted') badgeClass = 'badge-danger';
                                    
                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '12px 8px' }}>
                                                <a href="#" className="trajectory-link mono text-primary font-medium" style={{ textDecoration: 'none' }} onClick={(e) => handleTrajectoryClick(e, t.plate)}>{t.plate}</a>
                                            </td>
                                            <td style={{ padding: '12px 8px' }} className="text-sm">{t.firstSeen}</td>
                                            <td style={{ padding: '12px 8px' }} className="text-sm">{t.lastSeen}</td>
                                            <td style={{ padding: '12px 8px' }}>{t.cameras}</td>
                                            <td style={{ padding: '12px 8px' }}><span className={`badge ${badgeClass}`}>{t.status}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">System Health</h2>
                </div>
                <div className="card-body">
                    <div className="health-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                        {DASHBOARD.systemHealth.map((h, idx) => {
                            const statusColor = h.status === 'Operational' ? 'var(--success-color, #10b981)' : (h.status === 'Warning' ? 'var(--warning-color, #f59e0b)' : 'var(--danger-color, #ef4444)');
                            return (
                                <div key={idx} className="health-card flex items-center gap-12" style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <div className="health-icon" style={{ fontSize: '24px' }}>{h.icon || '🖥️'}</div>
                                    <div className="health-info">
                                        <div className="health-name font-medium">{h.name}</div>
                                        <div className="health-status text-sm" style={{ color: statusColor, fontWeight: 500 }}>{h.status}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
