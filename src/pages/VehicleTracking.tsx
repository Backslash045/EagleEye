import React, { useState, useEffect, useRef } from 'react';
import { TRACKED_VEHICLES, DEFAULT_PLATE } from '../data';
import { createMap, addTrajectory } from '../components/map';

export default function VehicleTracking() {
    const [plateSearch, setPlateSearch] = useState(DEFAULT_PLATE);
    const [loading, setLoading] = useState(false);
    const [vehicle, setVehicle] = useState<any>(null);
    const [searched, setSearched] = useState(false);
    const [activeDetection, setActiveDetection] = useState<number | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    const performSearch = (plateStr: string) => {
        const plate = plateStr.trim().toUpperCase();
        if (!plate) return;

        setLoading(true);
        setSearched(true);
        setVehicle(null);

        setTimeout(() => {
            setLoading(false);
            const foundVehicle = Object.values(TRACKED_VEHICLES).find(
                (v: any) => v.plate.replace(/\s/g, '') === plate.replace(/\s/g, '')
            );
            setVehicle(foundVehicle || null);
        }, 1200);
    };

    useEffect(() => {
        performSearch(DEFAULT_PLATE);
    }, []);

    useEffect(() => {
        if (vehicle && mapContainerRef.current) {
            // Re-create map
            if (mapInstanceRef.current && mapInstanceRef.current.remove) {
                mapInstanceRef.current.remove();
            }
            
            // Assuming createMap works by taking a DOM element or ID
            // Since vanilla took an ID, let's give the div an ID or modify createMap call
            // If createMap expects an ID string, we pass the ID.
            mapInstanceRef.current = createMap('trackingMap', { center: [22.5726, 88.3639], zoom: 12 });

            if (vehicle.sightings && vehicle.sightings.length > 0) {
                addTrajectory(mapInstanceRef.current, vehicle.sightings, true);
            }
        }
    }, [vehicle]);

    const handleDetectionClick = (s: any) => {
        setActiveDetection(s.seq);
        if (mapInstanceRef.current && !isNaN(s.lat) && !isNaN(s.lng)) {
            if (mapInstanceRef.current.flyTo) {
                mapInstanceRef.current.flyTo([s.lat, s.lng], 15, { duration: 0.8 });
            }
        }
    };

    const handleSearch = () => {
        performSearch(plateSearch);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="page vehicle-tracking-page page-enter">
            {/* Search Bar */}
            <div className="panel mb-16">
                <div className="panel-body" style={{ padding: '14px 18px' }}>
                    <div className="input-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <input 
                                type="text" 
                                className="form-input" 
                                style={{ paddingLeft: '36px', fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', monospace", fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' }} 
                                placeholder="Enter license plate (e.g. WB 26 AE 7834)" 
                                value={plateSearch}
                                onChange={(e) => setPlateSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <button 
                            className="btn btn-primary btn-lg" 
                            style={{ whiteSpace: 'nowrap', opacity: loading ? 0.6 : 1 }}
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" /><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="0.5" x2="8" y2="3.5" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="12.5" x2="8" y2="15.5" stroke="currentColor" strokeWidth="1.5" /><line x1="0.5" y1="8" x2="3.5" y2="8" stroke="currentColor" strokeWidth="1.5" /><line x1="12.5" y1="8" x2="15.5" y2="8" stroke="currentColor" strokeWidth="1.5" /></svg>
                            TRACK VEHICLE
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div id="loadingSkeleton">
                    <div className="metric-cards mb-16">
                        {[1, 2, 3, 4].map(i => (
                            <div className="metric-card" key={i}>
                                <div className="skeleton skeleton-text" style={{ width: '60%', height: '12px', marginBottom: '12px' }}></div>
                                <div className="skeleton" style={{ width: '40%', height: '28px' }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="skeleton" style={{ height: '420px', borderRadius: 'var(--radius-lg)' }}></div>
                </div>
            )}

            {/* Results Container */}
            {!loading && searched && vehicle && (
                <div id="resultsContainer">
                    {/* Metrics Row */}
                    <div className="metric-cards mb-16">
                        <div className="metric-card">
                            <div className="metric-icon blue">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 10.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" fill="currentColor" /></svg>
                            </div>
                            <div className="metric-label">Sightings</div>
                            <div className="metric-value">{vehicle.metrics.sightings}</div>
                            <div className="metric-change up" style={{ marginTop: '4px' }}>across {vehicle.metrics.sightings} cameras</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-icon green">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </div>
                            <div className="metric-label">Duration</div>
                            <div className="metric-value">{vehicle.metrics.duration}</div>
                            <div className="text-xs text-tertiary" style={{ marginTop: '4px' }}>{vehicle.firstSeen?.split(',')[1]?.trim() || ''} — {vehicle.lastSeen?.split(',')[1]?.trim() || ''}</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-icon orange">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 13h2l1.5-3h7L14 13h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="5" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.3" /><circle cx="13" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.5" /></svg>
                            </div>
                            <div className="metric-label">Avg Speed</div>
                            <div className="metric-value">{vehicle.metrics.avgSpeed}<span className="metric-unit">km/h</span></div>
                            <div className="text-xs text-tertiary" style={{ marginTop: '4px' }}>City speed limit: 50 km/h</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-icon blue">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="9" r="1" fill="currentColor" /></svg>
                            </div>
                            <div className="metric-label">OCR Confidence</div>
                            <div className="metric-value">{vehicle.metrics.ocrConfidence}<span className="metric-unit">%</span></div>
                            <div className="metric-change up" style={{ marginTop: '4px' }}>High accuracy</div>
                        </div>
                    </div>

                    {/* Map + Detection Panel */}
                    <div className="split-layout" style={{ alignItems: 'start' }}>
                        {/* Map Panel */}
                        <div className="panel" style={{ overflow: 'hidden' }}>
                            <div className="panel-header">
                                <span className="panel-title">Trajectory Map</span>
                                <span className="badge badge-info" style={{ fontFamily: "'SF Mono', monospace", letterSpacing: '0.04em' }}>{vehicle.plate}</span>
                            </div>
                            <div style={{ padding: 0 }}>
                                <div id="trackingMap" ref={mapContainerRef} className="map-container" style={{ height: '480px', borderRadius: 0 }}></div>
                            </div>
                        </div>

                        {/* Right Panel */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '544px' }}>
                            {/* Detection History */}
                            <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <div className="panel-header" style={{ flexShrink: 0 }}>
                                    <span className="panel-title">Detection History</span>
                                    <span className="text-sm text-tertiary">{vehicle.sightings.length} detections</span>
                                </div>
                                <div className="panel-body scrollable" style={{ flex: 1, overflowY: 'auto', padding: '8px 14px' }}>
                                    <ul className="detection-list">
                                        {vehicle.sightings.map((s: any) => {
                                            const confColor = s.confidence >= 96 ? 'var(--success)' : s.confidence >= 93 ? 'var(--warning)' : 'var(--danger)';
                                            const isActive = activeDetection === s.seq;
                                            return (
                                                <li 
                                                    key={s.seq}
                                                    className="detection-item" 
                                                    style={{ cursor: 'pointer', background: isActive ? 'var(--accent-soft)' : '' }}
                                                    onClick={() => handleDetectionClick(s)}
                                                >
                                                    <div className="detection-marker">{String(s.seq).padStart(2, '0')}</div>
                                                    <div className="detection-info">
                                                        <div className="detection-camera">{s.camera}</div>
                                                        <div className="detection-location">{s.location}</div>
                                                        <div className="detection-time">{s.timestamp}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                        <div className="detection-confidence" style={{ color: confColor }}>{s.confidence}%</div>
                                                        <div className="confidence-bar" style={{ width: '52px', marginTop: '4px' }}>
                                                            <div className="confidence-fill" style={{ width: `${s.confidence}%`, background: confColor }}></div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>

                            {/* Trajectory Validation */}
                            <div className="panel" style={{ flexShrink: 0 }}>
                                <div className="panel-header">
                                    <span className="panel-title">Trajectory Validation</span>
                                </div>
                                <div className="panel-body" style={{ padding: '10px 18px' }}>
                                    <ul className="checklist">
                                        {[
                                            { key: 'multiFrameOCR', label: 'Multi-frame OCR fusion', passed: vehicle.validation.multiFrameOCR },
                                            { key: 'plateConsistency', label: 'Plate consistency check', passed: vehicle.validation.plateConsistency },
                                            { key: 'gpsProjection', label: 'GPS projection match', passed: vehicle.validation.gpsProjection },
                                            { key: 'speedPlausibility', label: 'Speed plausibility', passed: vehicle.validation.speedPlausibility },
                                        ].map(c => (
                                            <li className="checklist-item" key={c.key}>
                                                <div className="checklist-icon" style={{ background: c.passed ? 'var(--success-soft)' : 'var(--danger-soft)', color: c.passed ? 'var(--success)' : 'var(--danger)' }}>
                                                    {c.passed ? '✓' : '✗'}
                                                </div>
                                                <span style={{ color: `var(--text-${c.passed ? 'secondary' : 'danger'})` }}>{c.label}</span>
                                                <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600, color: c.passed ? 'var(--success)' : 'var(--danger)' }}>
                                                    {c.passed ? 'PASS' : 'FAIL'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '10px', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Overall Confidence</div>
                                            <div className="text-xs text-tertiary">Trajectory reliability</div>
                                        </div>
                                        <div className="progress-ring" style={{ position: 'relative', width: '56px', height: '56px' }}>
                                            <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
                                                <circle cx="28" cy="28" r="24" fill="none" stroke="var(--border)" strokeWidth="4" />
                                                <circle 
                                                    cx="28" cy="28" r="24" fill="none" 
                                                    stroke={vehicle.overallConfidence >= 90 ? 'var(--success)' : vehicle.overallConfidence >= 75 ? 'var(--warning)' : 'var(--danger)'} 
                                                    strokeWidth="4"
                                                    strokeDasharray={2 * Math.PI * 24} 
                                                    strokeDashoffset={(2 * Math.PI * 24) * (1 - vehicle.overallConfidence / 100)}
                                                    strokeLinecap="round" 
                                                    style={{ transition: 'stroke-dashoffset 1s ease' }} 
                                                />
                                            </svg>
                                            <div className="progress-ring-text" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {vehicle.overallConfidence}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && searched && !vehicle && (
                <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                    <div className="empty-state-icon">🔍</div>
                    <h3 className="empty-state-title">Vehicle Not Found</h3>
                    <p className="empty-state-desc">No tracking data found for the specified license plate. Try one of the demo plates: WB 26 AE 7834, WB 14 CD 9021, or WB 02 BX 1456.</p>
                </div>
            )}
        </div>
    );
}
