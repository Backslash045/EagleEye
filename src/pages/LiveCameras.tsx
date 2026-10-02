import React, { useState } from 'react';
import { CAMERAS } from '../data';

const LiveCameras: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const [selectedCamera, setSelectedCamera] = useState<any>(null);

    const camerasToShow = CAMERAS.slice(0, 8);
    const filteredCameras = camerasToShow.filter(cam => filter === 'all' || cam.status === filter);

    return (
        <div className="page page-live-cameras">
            <div className="page-header flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-header-title text-2xl font-bold text-white">Live Camera Feeds</h1>
                    <p className="text-secondary text-sm mt-1">248 cameras online</p>
                </div>
                <div className="filter-chips flex gap-2">
                    {['all', 'online', 'offline'].map(f => (
                        <button 
                            key={f}
                            className={`filter-chip btn btn-sm btn-secondary ${filter === f ? 'active bg-gray-700' : ''}`} 
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="camera-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCameras.map((camera, idx) => {
                    let badgeClass = 'badge-success';
                    if (camera.status === 'offline') badgeClass = 'badge-danger';
                    if (camera.status === 'degraded') badgeClass = 'badge-warning';

                    return (
                        <div 
                            key={idx} 
                            className="card camera-card transition-transform duration-200 hover:-translate-y-1 cursor-pointer" 
                            onClick={() => setSelectedCamera(camera)}
                        >
                            <div className="camera-feed relative" style={{ height: '200px', background: '#1a1a24', borderRadius: '8px 8px 0 0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="feed-pattern absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4a4a6a 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                <div className="feed-pattern-icon text-4xl opacity-50">📹</div>
                                <div className="camera-feed-overlay absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)' }}></div>
                                <div className="camera-feed-label absolute bottom-3 left-3 text-white font-mono text-xs font-bold">{camera.id}</div>
                                {camera.status === 'online' && (
                                    <div className="camera-live-indicator"><span className="camera-live-dot pulse"></span> LIVE</div>
                                )}
                            </div>
                            <div className="camera-info p-4">
                                <div className="camera-name font-bold text-lg text-white mb-1">{camera.name}</div>
                                <div className="camera-location text-sm text-secondary mb-3">{camera.zone}</div>
                                <div className="camera-meta flex justify-between items-center text-xs">
                                    <span className={`badge ${badgeClass} uppercase`}>{camera.status}</span>
                                    <span className="text-tertiary">{camera.lastDetection || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div 
                className={`modal-overlay fixed inset-0 bg-black/80 items-center justify-center z-50 ${selectedCamera ? 'flex' : 'hidden'}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) setSelectedCamera(null);
                }}
            >
                {selectedCamera && (
                    <div className="modal card w-full max-w-3xl border border-gray-700 bg-gray-900 shadow-xl overflow-hidden rounded-xl">
                        <div className="modal-header flex justify-between items-center p-4 border-b border-gray-800">
                            <h3 className="modal-title font-bold text-white">{selectedCamera.id} - {selectedCamera.name}</h3>
                            <button className="btn btn-ghost btn-sm close-modal text-gray-400 hover:text-white" onClick={() => setSelectedCamera(null)}>&times;</button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="camera-feed relative" style={{ height: '400px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="feed-pattern absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4a4a6a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                <div className="feed-pattern-icon text-6xl opacity-40">📹</div>
                                <div className="camera-live-indicator absolute top-4 right-4 text-white bg-red-600/80 px-2 py-1 rounded text-xs flex items-center gap-2">
                                    <span className="camera-live-dot pulse bg-white w-2 h-2 rounded-full"></span> LIVE
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm text-secondary font-bold mb-3 uppercase tracking-wider">Camera Info</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="text-tertiary">Zone</div><div className="text-white font-medium">{selectedCamera.zone}</div>
                                        <div className="text-tertiary">Status</div>
                                        <div>
                                            <span className={`badge ${selectedCamera.status === 'offline' ? 'badge-danger' : selectedCamera.status === 'degraded' ? 'badge-warning' : 'badge-success'} uppercase`}>
                                                {selectedCamera.status}
                                            </span>
                                        </div>
                                        <div className="text-tertiary">Uptime</div><div className="text-white font-medium">{selectedCamera.uptime ? selectedCamera.uptime + '%' : '99.9%'}</div>
                                        <div className="text-tertiary">Last Detection</div><div className="text-white font-medium">{selectedCamera.lastDetection || 'Just now'}</div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm text-secondary font-bold mb-3 uppercase tracking-wider">Recent Detections</h4>
                                    <div className="detection-list flex flex-col gap-3 text-sm">
                                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                                            <span className="font-mono text-accent">MH 12 AB 1234</span>
                                            <span className="text-tertiary text-xs">2 min ago</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                                            <span className="font-mono text-accent">KA 01 CD 5678</span>
                                            <span className="text-tertiary text-xs">5 min ago</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                                            <span className="font-mono text-accent">DL 4C EF 9012</span>
                                            <span className="text-tertiary text-xs">12 min ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveCameras;
