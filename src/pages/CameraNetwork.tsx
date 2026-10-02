import React, { useState, useEffect, useRef } from 'react';
import { CAMERAS } from '../data';
// @ts-ignore
import { createMap, addCameraMarkers, clearOverlays } from '../components/map';

const CameraNetwork: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
    const mapRef = useRef<any>(null);
    const markersLayerRef = useRef<any>(null);
    
    const camerasToShow = CAMERAS.slice(0, 48);

    useEffect(() => {
        const map = createMap('networkMap', {
            center: [22.5726, 88.3639],
            zoom: 12
        });
        mapRef.current = map;

        if (map) {
            markersLayerRef.current = addCameraMarkers(map, camerasToShow);
        }
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            const filteredCameras = camerasToShow.filter(cam => filter === 'all' || cam.status === filter);
            if (markersLayerRef.current) {
                clearOverlays(markersLayerRef.current);
            }
            markersLayerRef.current = addCameraMarkers(mapRef.current, filteredCameras);
        }
    }, [filter]);

    const handleRowClick = (camera: any) => {
        setSelectedCameraId(camera.id);
        const lat = parseFloat(camera.lat);
        const lng = parseFloat(camera.lng);
        if (!isNaN(lat) && !isNaN(lng) && mapRef.current) {
            if (mapRef.current.flyTo) {
                mapRef.current.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
            }
        }
    };

    const filters = [
        { id: 'all', label: 'All 256' },
        { id: 'online', label: 'Online 248' },
        { id: 'degraded', label: 'Degraded 5' },
        { id: 'offline', label: 'Offline 3' }
    ];

    const filteredCameras = camerasToShow.filter(cam => filter === 'all' || cam.status === filter);

    return (
        <div className="page page-camera-network h-full flex flex-col">
            <div className="page-header flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-header-title text-2xl font-bold text-white">Camera Network</h1>
                    <p className="text-secondary text-sm mt-1">248 Online &bull; 5 Degraded &bull; 3 Offline</p>
                </div>
                <div className="filter-chips flex gap-2">
                    {filters.map(f => (
                        <button 
                            key={f.id}
                            className={`filter-chip btn btn-sm btn-secondary ${filter === f.id ? 'active bg-gray-700' : ''}`}
                            onClick={() => setFilter(f.id)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="split-layout flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
                <div className="w-full lg:w-2/3 card p-0 overflow-hidden flex flex-col relative">
                    <div id="networkMap" className="map-container map-lg w-full h-full flex-1"></div>
                </div>
                
                <div className="w-full lg:w-1/3 panel card flex flex-col h-full max-h-[600px] lg:max-h-none">
                    <div className="panel-header p-4 border-b border-gray-800">
                        <h2 className="panel-title font-bold text-white">Camera Directory</h2>
                    </div>
                    <div className="panel-body scrollable flex-1 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-gray-900 shadow">
                                <tr>
                                    <th className="p-3 text-xs uppercase tracking-wider text-gray-500 font-semibold cursor-pointer hover:text-white">ID</th>
                                    <th className="p-3 text-xs uppercase tracking-wider text-gray-500 font-semibold cursor-pointer hover:text-white">Location</th>
                                    <th className="p-3 text-xs uppercase tracking-wider text-gray-500 font-semibold cursor-pointer hover:text-white">Zone</th>
                                    <th className="p-3 text-xs uppercase tracking-wider text-gray-500 font-semibold cursor-pointer hover:text-white">Status</th>
                                    <th className="p-3 text-xs uppercase tracking-wider text-gray-500 font-semibold text-right cursor-pointer hover:text-white">Uptime %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCameras.map((camera, idx) => {
                                    let badgeClass = 'badge-success';
                                    if (camera.status === 'offline') badgeClass = 'badge-danger';
                                    if (camera.status === 'degraded') badgeClass = 'badge-warning';

                                    return (
                                        <tr 
                                            key={idx}
                                            className={`camera-row cursor-pointer hover:bg-gray-800 transition-colors border-b border-gray-800 ${selectedCameraId === camera.id ? 'bg-gray-800' : ''}`}
                                            onClick={() => handleRowClick(camera)}
                                        >
                                            <td className="p-3 font-mono text-sm text-white">{camera.id}</td>
                                            <td className="p-3 text-sm text-gray-300 truncate max-w-[150px]">{camera.name}</td>
                                            <td className="p-3 text-sm text-gray-400">{camera.zone}</td>
                                            <td className="p-3"><span className={`badge ${badgeClass} text-xs uppercase`}>{camera.status}</span></td>
                                            <td className="p-3 text-sm text-right text-gray-300">{camera.uptime || '99.9'}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CameraNetwork;
