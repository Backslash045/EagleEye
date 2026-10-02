import React, { useEffect, useState } from 'react';
import { VEHICLE_INTELLIGENCE, DEFAULT_PLATE } from '../data';
import { createBarChart, createDoughnutChart } from '../components/charts';

export default function VehicleIntelligence({ plate = DEFAULT_PLATE }: { plate?: string }) {
    const vData = (VEHICLE_INTELLIGENCE as any)[plate] || (VEHICLE_INTELLIGENCE as any)[DEFAULT_PLATE] || {};
    
    const type = vData.vehicleType || 'Sedan';
    const color = vData.color || 'Silver';
    const make = vData.make || 'Maruti Ciaz';
    const firstSeen = vData.firstSeen || '02 Sep 2026';
    const lastSeen = vData.lastSeen || '14 Sep 2026';
    const totalSightings = vData.totalSightings || 142;

    const [isFlagged, setIsFlagged] = useState(vData.flagged || false);
    const [isWatchlisted, setIsWatchlisted] = useState(vData.watchlist || false);

    useEffect(() => {
        // Zone Chart
        const zonesData = vData.zones || { 'North Zone': 45, 'South Zone': 30, 'East Zone': 15, 'West Zone': 25, 'Central Zone': 27 };
        const zoneLabels = Object.keys(zonesData);
        const zoneValues = Object.values(zonesData) as number[];
        const zoneColors = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#14b8a6'];
        
        const zoneTimer = setTimeout(() => {
            createDoughnutChart('zoneChart', zoneLabels, zoneValues, zoneColors, { cutout: '60%', showLegend: false });
        }, 100);

        // Hourly Chart
        const hourlyData = (vData.hourlyPattern as number[]) || [5,3,1,0,0,2,10,25,35,40,30,25,20,18,22,30,45,50,35,20,15,10,8,6];
        const hourlyLabels = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0') + ':00');
        
        const hourlyTimer = setTimeout(() => {
            createBarChart('hourlyChart', hourlyLabels, hourlyData, { label: 'Activity by Hour', color: '#3b82f6' });
        }, 100);

        return () => {
            clearTimeout(zoneTimer);
            clearTimeout(hourlyTimer);
        };
    }, [vData]);

    const alerts = vData.alerts || [
        { severity: 'critical', reason: 'Speeding > 120km/h', time: '14:30' },
        { severity: 'warning', reason: 'Red Light Violation', time: '09:15' },
        { severity: 'info', reason: 'Unusual Route Detected', time: '08:45' }
    ];

    const routes = vData.recentRoutes || [
        'North Toll -> Main Intersection -> South Exit',
        'East Gate -> Commercial Street -> Downtown',
        'Downtown -> West Blvd -> North Toll'
    ];

    const zonesData = vData.zones || { 'North Zone': 45, 'South Zone': 30, 'East Zone': 15, 'West Zone': 25, 'Central Zone': 27 };
    const zoneLabels = Object.keys(zonesData);
    const zoneValues = Object.values(zonesData) as number[];
    const zoneColors = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#14b8a6'];

    return (
        <div className="page">
            <div className="page-header mb-20">
                <h1 className="page-header-title text-2xl font-bold">Vehicle Intelligence</h1>
            </div>

            {/* Top: Vehicle profile header */}
            <div className="vehicle-profile-header card mb-20 p-20 border rounded">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <div className="vehicle-plate-display text-2xl font-bold mono mb-12 text-primary" style={{ fontSize: '2rem' }}>{plate}</div>
                        <div className="vehicle-details-grid grid-2 gap-12 mt-12 text-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            <div className="vehicle-detail-item flex flex-col gap-4">
                                <span className="vehicle-detail-label text-secondary text-xs uppercase">Vehicle Type</span>
                                <span className="vehicle-detail-value font-medium">{type}</span>
                            </div>
                            <div className="vehicle-detail-item flex flex-col gap-4">
                                <span className="vehicle-detail-label text-secondary text-xs uppercase">Registration Type</span>
                                <span className="vehicle-detail-value font-medium">{vData.registrationType || 'Personal'}</span>
                            </div>
                            <div className="vehicle-detail-item flex flex-col gap-4">
                                <span className="vehicle-detail-label text-secondary text-xs uppercase">Fuel / Propulsion</span>
                                <span className="vehicle-detail-value font-medium">{vData.fuelType || 'Petrol'}</span>
                            </div>
                            <div className="vehicle-detail-item flex flex-col gap-4">
                                <span className="vehicle-detail-label text-secondary text-xs uppercase">Color</span>
                                <span className="vehicle-detail-value font-medium">{color}</span>
                            </div>
                            <div className="vehicle-detail-item flex flex-col gap-4">
                                <span className="vehicle-detail-label text-secondary text-xs uppercase">Make</span>
                                <span className="vehicle-detail-value font-medium">{make}</span>
                            </div>
                            <div className="vehicle-detail-item flex flex-col gap-4">
                                <span className="vehicle-detail-label text-secondary text-xs uppercase">First Seen</span>
                                <span className="vehicle-detail-value font-medium">{firstSeen}</span>
                            </div>
                            <div className="vehicle-detail-item flex flex-col gap-4">
                                <span className="vehicle-detail-label text-secondary text-xs uppercase">Last Seen</span>
                                <span className="vehicle-detail-value font-medium">{lastSeen}</span>
                            </div>
                            <div className="vehicle-detail-item flex flex-col gap-4">
                                <span className="vehicle-detail-label text-secondary text-xs uppercase">Total Sightings</span>
                                <span className="vehicle-detail-value font-bold text-accent">{totalSightings}</span>
                            </div>
                        </div>
                    </div>
                    <div className="action-bar flex flex-col gap-8">
                        <button 
                            className={`btn btn-sm ${isFlagged ? 'btn-secondary' : 'btn-danger'}`} 
                            onClick={() => setIsFlagged(!isFlagged)}
                        >
                            {isFlagged ? 'Unflag Vehicle' : 'Flag Vehicle'}
                        </button>
                        <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => setIsWatchlisted(!isWatchlisted)}
                        >
                            {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Below: grid-2 layout */}
            <div className="grid-2 gap-16 mb-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* LEFT: Card Sighting Distribution by Zone */}
                <div className="card panel border rounded">
                    <div className="card-header panel-header p-12 border-b">
                        <h3 className="card-title panel-title font-semibold">Sighting Distribution by Zone</h3>
                    </div>
                    <div className="card-body panel-body p-16 flex flex-col items-center">
                        <div className="chart-container w-full" style={{ height: '250px', position: 'relative' }}>
                            <canvas id="zoneChart"></canvas>
                        </div>
                        <div className="mt-16 text-sm w-full">
                            <div className="grid-2 gap-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                {zoneLabels.map((label, i) => (
                                    <div key={label} className="flex items-center gap-8" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: zoneColors[i % zoneColors.length] }}></span>
                                        <span className="text-secondary">{label}</span>
                                        <span className="font-medium ml-auto">{zoneValues[i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Card Activity by Hour of Day */}
                <div className="card panel border rounded">
                    <div className="card-header panel-header p-12 border-b">
                        <h3 className="card-title panel-title font-semibold">Activity by Hour of Day</h3>
                    </div>
                    <div className="card-body panel-body p-16">
                        <div className="chart-container w-full" style={{ height: '250px', position: 'relative' }}>
                            <canvas id="hourlyChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            {/* Below charts: two sections side by side */}
            <div className="grid-2 gap-16" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* LEFT: Recent Alerts */}
                <div className="card panel border rounded">
                    <div className="card-header panel-header p-12 border-b">
                        <h3 className="card-title panel-title font-semibold">Recent Alerts</h3>
                    </div>
                    <div className="card-body panel-body scrollable p-16" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {alerts.length === 0 ? (
                            <div className="text-secondary text-sm">No recent alerts.</div>
                        ) : (
                            alerts.map((a: any, idx: number) => {
                                let badgeClass = 'badge-info';
                                if (a.severity === 'critical') badgeClass = 'badge-danger';
                                else if (a.severity === 'warning') badgeClass = 'badge-warning';

                                return (
                                    <div key={idx} className={`alert-item ${a.severity} mb-12 p-12 border rounded flex justify-between items-start`} style={{ marginBottom: '0.75rem', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <div className="flex flex-col gap-4">
                                            <span className={`badge ${badgeClass} text-xs uppercase`} style={{ alignSelf: 'flex-start' }}>{a.severity}</span>
                                            <span className="font-medium mt-4">{a.reason}</span>
                                        </div>
                                        <span className="text-secondary text-sm">{a.time}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* RIGHT: Common Routes */}
                <div className="card panel border rounded">
                    <div className="card-header panel-header p-12 border-b">
                        <h3 className="card-title panel-title font-semibold">Common Routes</h3>
                    </div>
                    <div className="card-body panel-body scrollable p-16" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {routes.length === 0 ? (
                            <div className="text-secondary text-sm">No common routes data.</div>
                        ) : (
                            <ol className="list-decimal pl-20" style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                                {routes.map((r: string, idx: number) => (
                                    <li key={idx} className="mb-12" style={{ marginBottom: '0.75rem' }}>
                                        <span className="font-medium text-secondary">
                                            {r.split('->').map((part, i, arr) => (
                                                <React.Fragment key={i}>
                                                    {part}
                                                    {i < arr.length - 1 && <span className="text-primary mx-4"> &rarr; </span>}
                                                </React.Fragment>
                                            ))}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
