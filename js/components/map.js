/* ============================================================
   EagleEye – Shared Map Helpers (Google Maps)
   ============================================================ */

const KOLKATA_CENTER = { lat: 22.5726, lng: 88.3639 };
const DEFAULT_ZOOM = 12;

// Track all active maps for theme switching & cleanup
const activeMaps = new Map();

/* ---------- Dark Theme Styles ---------- */
const DARK_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#212121' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
    { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { featureType: 'poi.park', elementType: 'labels.text.stroke', stylers: [{ color: '#1b1b1b' }] },
    { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
    { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#4e4e4e' }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
];

const LIGHT_STYLE = [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
    { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
];

function getThemeStyles() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    return theme === 'dark' ? DARK_STYLE : LIGHT_STYLE;
}

/**
 * Create a Google Map in the given container.
 * @param {string} containerId - DOM element ID
 * @param {object} options - { center: [lat, lng], zoom }
 * @returns {google.maps.Map}
 */
export function createMap(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    // Cleanup existing map on this container
    if (activeMaps.has(containerId)) {
        const prev = activeMaps.get(containerId);
        // Clear all overlays
        if (prev.overlays) prev.overlays.forEach(o => {
            if (o.setMap) o.setMap(null);
        });
        activeMaps.delete(containerId);
        container.innerHTML = '';
    }

    // Normalize center: accept [lat, lng] array or { lat, lng } object
    let center = KOLKATA_CENTER;
    if (options.center) {
        center = Array.isArray(options.center)
            ? { lat: options.center[0], lng: options.center[1] }
            : options.center;
    }

    const map = new google.maps.Map(container, {
        center: center,
        zoom: options.zoom || DEFAULT_ZOOM,
        styles: getThemeStyles(),
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
    });

    // Store for theme switching
    activeMaps.set(containerId, { map, overlays: [] });

    // Add compatibility method: flyTo (matches Leaflet API)
    map.flyTo = function (center, zoom, opts) {
        const latLng = Array.isArray(center)
            ? { lat: center[0], lng: center[1] }
            : center;
        this.panTo(latLng);
        if (zoom !== undefined) this.setZoom(zoom);
    };

    return map;
}

/**
 * Track an overlay for cleanup/theme-switching.
 */
function trackOverlay(containerId, overlay) {
    if (activeMaps.has(containerId)) {
        activeMaps.get(containerId).overlays.push(overlay);
    }
}

function getContainerId(map) {
    for (const [id, entry] of activeMaps) {
        if (entry.map === map) return id;
    }
    return null;
}

/**
 * Add numbered trajectory markers + polyline to a map.
 * @param {google.maps.Map} map
 * @param {Array} sightings - [{ seq, lat, lng, camera, location, timestamp, confidence }]
 * @returns {{ polyline, markers }}
 */
export function addTrajectory(map, sightings) {
    const containerId = getContainerId(map);
    const path = sightings.map(s => ({ lat: s.lat, lng: s.lng }));
    const markers = [];

    const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#2563eb';

    // Polyline
    const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: accentColor,
        strokeOpacity: 0.9,
        strokeWeight: 3,
        map: map,
    });
    if (containerId) trackOverlay(containerId, polyline);

    // Info window (shared)
    const infoWindow = new google.maps.InfoWindow();

    // Numbered markers
    sightings.forEach((s, i) => {
        const marker = new google.maps.Marker({
            position: { lat: s.lat, lng: s.lng },
            map: map,
            label: {
                text: String(s.seq).padStart(2, '0'),
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: '700',
                fontFamily: 'Inter, system-ui, sans-serif',
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 15,
                fillColor: accentColor,
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2.5,
            },
            zIndex: 100 + i,
        });

        marker.addListener('click', () => {
            infoWindow.setContent(`
                <div style="min-width:180px;font-family:Inter,sans-serif;padding:4px;">
                    <div style="font-weight:600;margin-bottom:4px;font-size:13px;">${s.camera}</div>
                    <div style="font-size:12px;color:#6b7280;margin-bottom:2px;">${s.location}</div>
                    <div style="font-size:12px;color:#6b7280;">${s.timestamp}</div>
                    ${s.confidence ? `<div style="font-size:11px;margin-top:4px;color:#059669;">OCR: ${s.confidence}%</div>` : ''}
                </div>
            `);
            infoWindow.open(map, marker);
        });

        markers.push(marker);
        if (containerId) trackOverlay(containerId, marker);
    });

    // Fit bounds
    if (path.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        path.forEach(p => bounds.extend(p));
        map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
        // Prevent over-zoom
        google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            if (map.getZoom() > 14) map.setZoom(14);
        });
    }

    return { polyline, markers };
}

/**
 * Add camera markers (small colored dots) to a map.
 * @param {google.maps.Map} map
 * @param {Array} cameras - [{ lat, lng, status, id, name, uptime }]
 * @returns {google.maps.Marker[]}
 */
export function addCameraMarkers(map, cameras) {
    const containerId = getContainerId(map);
    const markers = [];
    const infoWindow = new google.maps.InfoWindow();

    cameras.forEach(cam => {
        const statusColor = cam.status === 'online' ? '#10b981'
            : cam.status === 'degraded' ? '#f59e0b' : '#ef4444';

        const marker = new google.maps.Marker({
            position: { lat: cam.lat, lng: cam.lng },
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                fillColor: statusColor,
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 1.5,
            },
            title: cam.id,
        });

        marker.addListener('click', () => {
            infoWindow.setContent(`
                <div style="min-width:160px;font-family:Inter,sans-serif;padding:4px;">
                    <div style="font-weight:600;margin-bottom:4px;font-size:13px;">${cam.id}</div>
                    <div style="font-size:12px;color:#6b7280;margin-bottom:2px;">${cam.name}</div>
                    <div style="font-size:11px;">
                        Status: <span style="color:${statusColor};font-weight:600;">${cam.status.toUpperCase()}</span>
                    </div>
                    ${cam.uptime ? `<div style="font-size:11px;color:#6b7280;margin-top:2px;">Uptime: ${cam.uptime}%</div>` : ''}
                </div>
            `);
            infoWindow.open(map, marker);
        });

        markers.push(marker);
        if (containerId) trackOverlay(containerId, marker);
    });

    return markers;
}

/**
 * Add a heatmap layer to the map.
 * @param {google.maps.Map} map
 * @param {Array} points - [[lat, lng, intensity], ...]
 * @returns {google.maps.visualization.HeatmapLayer}
 */
export function addHeatmap(map, points) {
    const containerId = getContainerId(map);

    // Google Maps HeatmapLayer works better with larger weight values
    const data = points.map(p => ({
        location: new google.maps.LatLng(p[0], p[1]),
        weight: (p[2] || 0.5) * 10,
    }));

    const heatmap = new google.maps.visualization.HeatmapLayer({
        data: data,
        map: map,
        radius: 30,
        opacity: 0.75,
        dissipating: true,
        gradient: [
            'rgba(0, 0, 0, 0)',
            'rgba(34, 197, 94, 0.4)',
            'rgba(34, 197, 94, 0.7)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(249, 115, 22, 0.85)',
            'rgba(239, 68, 68, 0.9)',
            'rgba(220, 38, 38, 1)',
        ],
    });

    if (containerId) trackOverlay(containerId, heatmap);
    return heatmap;
}

/**
 * Add congestion bottleneck indicators to the map.
 * @param {google.maps.Map} map
 * @param {Array} bottlenecks - [{ lat, lng, name, delay, severity }]
 */
export function addBottlenecks(map, bottlenecks) {
    const containerId = getContainerId(map);
    const infoWindow = new google.maps.InfoWindow();

    bottlenecks.forEach(b => {
        const color = b.severity === 'high' ? '#ef4444' : '#f59e0b';

        const circle = new google.maps.Circle({
            center: { lat: b.lat, lng: b.lng },
            radius: 300,
            fillColor: color,
            fillOpacity: 0.2,
            strokeColor: color,
            strokeOpacity: 0.6,
            strokeWeight: 2,
            map: map,
            clickable: true,
        });

        circle.addListener('click', () => {
            infoWindow.setPosition({ lat: b.lat, lng: b.lng });
            infoWindow.setContent(`
                <div style="min-width:140px;font-family:Inter,sans-serif;padding:4px;">
                    <div style="font-weight:600;margin-bottom:4px;">${b.name}</div>
                    <div style="font-size:12px;color:${color};font-weight:600;">Delay: ${b.delay}</div>
                </div>
            `);
            infoWindow.open(map);
        });

        if (containerId) trackOverlay(containerId, circle);
    });
}

/**
 * Remove an array of markers/overlays from the map.
 * @param {Array} overlays - array of google.maps.Marker, Polyline, Circle, etc.
 */
export function clearOverlays(overlays) {
    if (!overlays) return;
    overlays.forEach(o => {
        if (o && o.setMap) o.setMap(null);
    });
}

/**
 * Cleanup: destroy a map and all its overlays.
 */
export function destroyMap(containerId) {
    if (activeMaps.has(containerId)) {
        const entry = activeMaps.get(containerId);
        if (entry.overlays) entry.overlays.forEach(o => { if (o.setMap) o.setMap(null); });
        activeMaps.delete(containerId);
    }
}

// ===== Theme Change Listener =====
window.addEventListener('theme-changed', (e) => {
    const theme = e.detail.theme;
    const styles = theme === 'dark' ? DARK_STYLE : LIGHT_STYLE;
    activeMaps.forEach(({ map }) => {
        map.setOptions({ styles: styles });
    });
});
