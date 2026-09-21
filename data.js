/* ============================================================
   EagleEye – Mock Data
   Realistic Kolkata-based data for all demo pages
   ============================================================ */

// ===== Camera Data =====
export const CAMERAS = [
    { id: 'CAM-001', name: 'Howrah Bridge North',       zone: 'Central',     lat: 22.5851, lng: 88.3468, status: 'online',   uptime: 99.8, lastDetection: '2 min ago' },
    { id: 'CAM-002', name: 'Howrah Bridge South',       zone: 'Central',     lat: 22.5838, lng: 88.3462, status: 'online',   uptime: 99.6, lastDetection: '1 min ago' },
    { id: 'CAM-003', name: 'Park Street Junction',      zone: 'Central',     lat: 22.5527, lng: 88.3517, status: 'online',   uptime: 98.4, lastDetection: '3 min ago' },
    { id: 'CAM-004', name: 'Esplanade Crossing',        zone: 'Central',     lat: 22.5636, lng: 88.3521, status: 'online',   uptime: 99.1, lastDetection: '1 min ago' },
    { id: 'CAM-005', name: 'Sealdah Station Gate',      zone: 'East',        lat: 22.5698, lng: 88.3686, status: 'online',   uptime: 97.2, lastDetection: '5 min ago' },
    { id: 'CAM-006', name: 'Salt Lake Sector V',        zone: 'East',        lat: 22.5804, lng: 88.4169, status: 'online',   uptime: 99.5, lastDetection: '2 min ago' },
    { id: 'CAM-007', name: 'New Town Biswa Bangla',     zone: 'East',        lat: 22.5923, lng: 88.4736, status: 'online',   uptime: 99.9, lastDetection: '30 sec ago' },
    { id: 'CAM-008', name: 'Gariahat More',             zone: 'South',       lat: 22.5171, lng: 88.3685, status: 'online',   uptime: 96.8, lastDetection: '4 min ago' },
    { id: 'CAM-009', name: 'Tollygunge Phari',          zone: 'South',       lat: 22.4981, lng: 88.3476, status: 'online',   uptime: 98.9, lastDetection: '2 min ago' },
    { id: 'CAM-010', name: 'Jadavpur 8B',               zone: 'South',       lat: 22.4988, lng: 88.3717, status: 'online',   uptime: 99.3, lastDetection: '1 min ago' },
    { id: 'CAM-011', name: 'Dum Dum Cantonment',        zone: 'North',       lat: 22.6227, lng: 88.4199, status: 'online',   uptime: 97.5, lastDetection: '6 min ago' },
    { id: 'CAM-012', name: 'Barrackpore GT Road',       zone: 'North',       lat: 22.6396, lng: 88.3775, status: 'offline',  uptime: 0,    lastDetection: '2 hrs ago' },
    { id: 'CAM-013', name: 'Ballygunge Phari',          zone: 'South',       lat: 22.5289, lng: 88.3633, status: 'online',   uptime: 99.0, lastDetection: '3 min ago' },
    { id: 'CAM-014', name: 'Alipore Zoo Gate',           zone: 'South',       lat: 22.5323, lng: 88.3377, status: 'online',   uptime: 98.1, lastDetection: '8 min ago' },
    { id: 'CAM-015', name: 'Behala Chowrasta',          zone: 'Southwest',   lat: 22.4716, lng: 88.3104, status: 'online',   uptime: 95.6, lastDetection: '5 min ago' },
    { id: 'CAM-016', name: 'Rabindra Sadan',            zone: 'Central',     lat: 22.5401, lng: 88.3440, status: 'online',   uptime: 99.7, lastDetection: '1 min ago' },
    { id: 'CAM-017', name: 'College Street',            zone: 'Central',     lat: 22.5757, lng: 88.3617, status: 'degraded', uptime: 78.3, lastDetection: '12 min ago' },
    { id: 'CAM-018', name: 'Moulali Crossing',          zone: 'Central',     lat: 22.5607, lng: 88.3581, status: 'online',   uptime: 99.2, lastDetection: '2 min ago' },
    { id: 'CAM-019', name: 'EM Bypass - Science City',  zone: 'East',        lat: 22.5397, lng: 88.3971, status: 'online',   uptime: 98.8, lastDetection: '4 min ago' },
    { id: 'CAM-020', name: 'EM Bypass - Ruby',          zone: 'East',        lat: 22.5142, lng: 88.3973, status: 'online',   uptime: 99.4, lastDetection: '1 min ago' },
    { id: 'CAM-021', name: 'Ultadanga Flyover',         zone: 'East',        lat: 22.5833, lng: 88.3811, status: 'online',   uptime: 97.1, lastDetection: '7 min ago' },
    { id: 'CAM-022', name: 'Shyambazar Five Point',     zone: 'North',       lat: 22.5976, lng: 88.3683, status: 'online',   uptime: 99.0, lastDetection: '2 min ago' },
    { id: 'CAM-023', name: 'Kalighat Bridge',           zone: 'South',       lat: 22.5212, lng: 88.3452, status: 'online',   uptime: 98.5, lastDetection: '3 min ago' },
    { id: 'CAM-024', name: 'Rashbehari Avenue',         zone: 'South',       lat: 22.5228, lng: 88.3508, status: 'online',   uptime: 96.9, lastDetection: '5 min ago' },
    { id: 'CAM-025', name: 'Princep Ghat',              zone: 'Central',     lat: 22.5561, lng: 88.3361, status: 'online',   uptime: 99.6, lastDetection: '1 min ago' },
    { id: 'CAM-026', name: 'Vidyasagar Setu Toll',      zone: 'Central',     lat: 22.5523, lng: 88.3323, status: 'online',   uptime: 99.8, lastDetection: '30 sec ago' },
    { id: 'CAM-027', name: 'Babughat',                  zone: 'Central',     lat: 22.5656, lng: 88.3406, status: 'online',   uptime: 98.7, lastDetection: '4 min ago' },
    { id: 'CAM-028', name: 'Bagbazar Ghat',             zone: 'North',       lat: 22.6021, lng: 88.3618, status: 'online',   uptime: 97.8, lastDetection: '6 min ago' },
    { id: 'CAM-029', name: 'Lake Town Crossing',        zone: 'North',       lat: 22.5989, lng: 88.3975, status: 'offline',  uptime: 0,    lastDetection: '5 hrs ago' },
    { id: 'CAM-030', name: 'VIP Road - Airport Gate',   zone: 'North',       lat: 22.6428, lng: 88.4361, status: 'online',   uptime: 99.3, lastDetection: '2 min ago' },
    { id: 'CAM-031', name: 'Kankurgachi Junction',      zone: 'East',        lat: 22.5723, lng: 88.3834, status: 'online',   uptime: 98.2, lastDetection: '3 min ago' },
    { id: 'CAM-032', name: 'Dhakuria Bridge',           zone: 'South',       lat: 22.5108, lng: 88.3628, status: 'degraded', uptime: 82.1, lastDetection: '15 min ago' },
    { id: 'CAM-033', name: 'Kasba Golpark',             zone: 'South',       lat: 22.5172, lng: 88.3799, status: 'online',   uptime: 99.1, lastDetection: '1 min ago' },
    { id: 'CAM-034', name: 'Dunlop Bridge',             zone: 'North',       lat: 22.6389, lng: 88.3912, status: 'online',   uptime: 96.5, lastDetection: '8 min ago' },
    { id: 'CAM-035', name: 'Nagerbazar',                zone: 'North',       lat: 22.6145, lng: 88.4008, status: 'online',   uptime: 97.9, lastDetection: '4 min ago' },
    { id: 'CAM-036', name: 'Baguiati Flyover',          zone: 'East',        lat: 22.6003, lng: 88.4134, status: 'online',   uptime: 99.5, lastDetection: '2 min ago' },
    { id: 'CAM-037', name: 'Phoolbagan Crossing',       zone: 'East',        lat: 22.5672, lng: 88.3765, status: 'online',   uptime: 98.3, lastDetection: '5 min ago' },
    { id: 'CAM-038', name: 'Sovabazar Court',           zone: 'Central',     lat: 22.5906, lng: 88.3604, status: 'online',   uptime: 99.4, lastDetection: '1 min ago' },
    { id: 'CAM-039', name: 'Diamond Harbour Road',      zone: 'Southwest',   lat: 22.5086, lng: 88.3218, status: 'offline',  uptime: 0,    lastDetection: '8 hrs ago' },
    { id: 'CAM-040', name: 'Taratala Flyover',          zone: 'Southwest',   lat: 22.5087, lng: 88.3315, status: 'online',   uptime: 95.2, lastDetection: '9 min ago' },
    { id: 'CAM-041', name: 'Kidderpore Dock Gate',      zone: 'Southwest',   lat: 22.5325, lng: 88.3186, status: 'online',   uptime: 98.0, lastDetection: '3 min ago' },
    { id: 'CAM-042', name: 'New Alipore AJC Bose',     zone: 'South',       lat: 22.5156, lng: 88.3367, status: 'online',   uptime: 99.2, lastDetection: '2 min ago' },
    { id: 'CAM-043', name: 'Chetla Lock Gate',          zone: 'South',       lat: 22.5155, lng: 88.3422, status: 'online',   uptime: 97.4, lastDetection: '7 min ago' },
    { id: 'CAM-044', name: 'Entally Market',            zone: 'Central',     lat: 22.5642, lng: 88.3681, status: 'online',   uptime: 96.6, lastDetection: '6 min ago' },
    { id: 'CAM-045', name: 'Park Circus Seven Point',   zone: 'Central',     lat: 22.5401, lng: 88.3620, status: 'online',   uptime: 99.7, lastDetection: '1 min ago' },
    { id: 'CAM-046', name: 'AJC Bose Road Flyover',    zone: 'Central',     lat: 22.5510, lng: 88.3450, status: 'online',   uptime: 98.9, lastDetection: '3 min ago' },
    { id: 'CAM-047', name: 'Majerhat Bridge',           zone: 'Southwest',   lat: 22.5097, lng: 88.3236, status: 'online',   uptime: 99.0, lastDetection: '4 min ago' },
    { id: 'CAM-048', name: 'Bypass - Garia Station',    zone: 'South',       lat: 22.4623, lng: 88.3851, status: 'online',   uptime: 98.6, lastDetection: '2 min ago' },
];

// Generate remaining cameras (049-256) programmatically
const zones = ['Central', 'East', 'North', 'South', 'Southwest'];
const baseLocations = [
    'CIT Road', 'Lenin Sarani', 'Chinar Park', 'Rajarhat Main', 'Belghoria Expy',
    'Baranagar Trunk Rd', 'Sinthee More', 'BT Road Toll', 'Kestopur Canal',
    'Mukundapur', 'Garia Bazaar', 'Regent Park', 'Bansdroni', 'Thakurpukur',
    'Joka Tram Depot', 'Budge Budge Rd', 'Santoshpur', 'Rajpur Rd',
    'Netaji Nagar', 'Survey Park', 'Patuli Crossing', 'Narendrapur',
];
for (let i = 49; i <= 256; i++) {
    const idx = (i - 49) % baseLocations.length;
    const suffix = Math.floor((i - 49) / baseLocations.length) + 1;
    const isOffline = [56, 78, 112, 145, 189, 201, 234].includes(i);
    const isDegraded = [67, 93, 128, 167, 212].includes(i);
    CAMERAS.push({
        id: `CAM-${String(i).padStart(3, '0')}`,
        name: `${baseLocations[idx]}${suffix > 1 ? ' ' + suffix : ''}`,
        zone: zones[i % zones.length],
        lat: 22.45 + Math.random() * 0.25,
        lng: 88.28 + Math.random() * 0.25,
        status: isOffline ? 'offline' : isDegraded ? 'degraded' : 'online',
        uptime: isOffline ? 0 : isDegraded ? (70 + Math.random() * 15).toFixed(1) : (95 + Math.random() * 4.9).toFixed(1),
        lastDetection: isOffline ? `${Math.floor(1 + Math.random() * 12)} hrs ago` : `${Math.floor(1 + Math.random() * 10)} min ago`,
    });
}

// ===== Vehicle Tracking Data =====
export const TRACKED_VEHICLES = {
    'WB 26 AE 7834': {
        plate: 'WB 26 AE 7834',
        vehicleType: 'Sedan',
        color: 'Silver',
        make: 'Maruti Ciaz',
        firstSeen: '14 Sep 2026, 09:14 AM',
        lastSeen: '14 Sep 2026, 10:37 AM',
        metrics: {
            sightings: 7,
            duration: '1h 23m',
            avgSpeed: 34,
            ocrConfidence: 96.2,
        },
        sightings: [
            { seq: 1, camera: 'CAM-001', location: 'Howrah Bridge North',       lat: 22.5851, lng: 88.3468, timestamp: '09:14:22 AM', confidence: 97.1 },
            { seq: 2, camera: 'CAM-004', location: 'Esplanade Crossing',        lat: 22.5636, lng: 88.3521, timestamp: '09:28:45 AM', confidence: 95.8 },
            { seq: 3, camera: 'CAM-003', location: 'Park Street Junction',      lat: 22.5527, lng: 88.3517, timestamp: '09:41:03 AM', confidence: 98.2 },
            { seq: 4, camera: 'CAM-013', location: 'Ballygunge Phari',          lat: 22.5289, lng: 88.3633, timestamp: '09:55:17 AM', confidence: 94.5 },
            { seq: 5, camera: 'CAM-019', location: 'EM Bypass - Science City',  lat: 22.5397, lng: 88.3971, timestamp: '10:08:31 AM', confidence: 96.9 },
            { seq: 6, camera: 'CAM-006', location: 'Salt Lake Sector V',        lat: 22.5804, lng: 88.4169, timestamp: '10:22:56 AM', confidence: 95.3 },
            { seq: 7, camera: 'CAM-007', location: 'New Town Biswa Bangla',     lat: 22.5923, lng: 88.4736, timestamp: '10:37:14 AM', confidence: 96.7 },
        ],
        validation: {
            multiFrameOCR: true,
            plateConsistency: true,
            gpsProjection: true,
            speedPlausibility: true,
        },
        overallConfidence: 94,
    },
    'WB 14 CD 9021': {
        plate: 'WB 14 CD 9021',
        vehicleType: 'SUV',
        color: 'Black',
        make: 'Hyundai Creta',
        firstSeen: '14 Sep 2026, 08:02 AM',
        lastSeen: '14 Sep 2026, 09:45 AM',
        metrics: {
            sightings: 5,
            duration: '1h 43m',
            avgSpeed: 28,
            ocrConfidence: 92.8,
        },
        sightings: [
            { seq: 1, camera: 'CAM-011', location: 'Dum Dum Cantonment',        lat: 22.6227, lng: 88.4199, timestamp: '08:02:11 AM', confidence: 93.4 },
            { seq: 2, camera: 'CAM-022', location: 'Shyambazar Five Point',     lat: 22.5976, lng: 88.3683, timestamp: '08:18:44 AM', confidence: 91.7 },
            { seq: 3, camera: 'CAM-004', location: 'Esplanade Crossing',        lat: 22.5636, lng: 88.3521, timestamp: '08:42:09 AM', confidence: 94.1 },
            { seq: 4, camera: 'CAM-003', location: 'Park Street Junction',      lat: 22.5527, lng: 88.3517, timestamp: '09:11:33 AM', confidence: 92.0 },
            { seq: 5, camera: 'CAM-008', location: 'Gariahat More',             lat: 22.5171, lng: 88.3685, timestamp: '09:45:28 AM', confidence: 93.1 },
        ],
        validation: {
            multiFrameOCR: true,
            plateConsistency: true,
            gpsProjection: true,
            speedPlausibility: true,
        },
        overallConfidence: 91,
    },
    'WB 02 BX 1456': {
        plate: 'WB 02 BX 1456',
        vehicleType: 'Hatchback',
        color: 'White',
        make: 'Tata Altroz',
        firstSeen: '14 Sep 2026, 10:30 AM',
        lastSeen: '14 Sep 2026, 11:15 AM',
        metrics: {
            sightings: 4,
            duration: '0h 45m',
            avgSpeed: 41,
            ocrConfidence: 97.5,
        },
        sightings: [
            { seq: 1, camera: 'CAM-006', location: 'Salt Lake Sector V',        lat: 22.5804, lng: 88.4169, timestamp: '10:30:05 AM', confidence: 98.1 },
            { seq: 2, camera: 'CAM-021', location: 'Ultadanga Flyover',         lat: 22.5833, lng: 88.3811, timestamp: '10:44:19 AM', confidence: 97.2 },
            { seq: 3, camera: 'CAM-005', location: 'Sealdah Station Gate',      lat: 22.5698, lng: 88.3686, timestamp: '10:58:47 AM', confidence: 96.8 },
            { seq: 4, camera: 'CAM-018', location: 'Moulali Crossing',          lat: 22.5607, lng: 88.3581, timestamp: '11:15:33 AM', confidence: 97.9 },
        ],
        validation: {
            multiFrameOCR: true,
            plateConsistency: true,
            gpsProjection: true,
            speedPlausibility: false,
        },
        overallConfidence: 88,
    },
};

// Default demo plate
export const DEFAULT_PLATE = 'WB 26 AE 7834';

// ===== Alerts Data =====
export const ALERTS = [
    { id: 1,  type: 'blacklist',     plate: 'WB 14 CD 9021', reason: 'Blacklist Hit – Stolen Vehicle Report #4891',     severity: 'critical', camera: 'CAM-004', location: 'Esplanade Crossing',    timestamp: '3 min ago',   time: '10:34 AM' },
    { id: 2,  type: 'speed',         plate: 'WB 26 AE 7834', reason: 'Speed Anomaly – 87 km/h in 40 km/h zone',         severity: 'critical', camera: 'CAM-019', location: 'EM Bypass - Science City', timestamp: '8 min ago',  time: '10:29 AM' },
    { id: 3,  type: 'wrong_dir',     plate: 'WB 41 FG 3302', reason: 'Wrong Direction – Contraflow on one-way segment', severity: 'warning',  camera: 'CAM-016', location: 'Rabindra Sadan',          timestamp: '12 min ago', time: '10:25 AM' },
    { id: 4,  type: 'dwell',         plate: 'WB 09 HK 6678', reason: 'Excessive Dwell – Stationary >45 min at junction', severity: 'warning', camera: 'CAM-008', location: 'Gariahat More',            timestamp: '18 min ago', time: '10:19 AM' },
    { id: 5,  type: 'blacklist',     plate: 'KA 05 MN 2213', reason: 'Blacklist Hit – Inter-state BOLO alert',           severity: 'critical', camera: 'CAM-030', location: 'VIP Road - Airport Gate',  timestamp: '25 min ago', time: '10:12 AM' },
    { id: 6,  type: 'camera_drift',  plate: '—',             reason: 'Camera Drift – FOV shift >5° detected',            severity: 'info',     camera: 'CAM-017', location: 'College Street',           timestamp: '31 min ago', time: '10:06 AM' },
    { id: 7,  type: 'speed',         plate: 'WB 33 PP 9914', reason: 'Speed Anomaly – 92 km/h on Bypass restricted zone', severity: 'critical', camera: 'CAM-020', location: 'EM Bypass - Ruby',       timestamp: '38 min ago', time: '09:59 AM' },
    { id: 8,  type: 'wrong_dir',     plate: 'WB 72 RS 4450', reason: 'Wrong Direction – Reverse entry at toll plaza',    severity: 'warning',  camera: 'CAM-026', location: 'Vidyasagar Setu Toll',    timestamp: '42 min ago', time: '09:55 AM' },
    { id: 9,  type: 'dwell',         plate: 'WB 19 TU 5587', reason: 'Excessive Dwell – Stationary >30 min near school zone', severity: 'warning', camera: 'CAM-013', location: 'Ballygunge Phari',   timestamp: '51 min ago', time: '09:46 AM' },
    { id: 10, type: 'blacklist',     plate: 'DL 08 CQ 7723', reason: 'Blacklist Hit – Wanted vehicle from Delhi NCR',    severity: 'critical', camera: 'CAM-001', location: 'Howrah Bridge North',    timestamp: '1 hr ago',   time: '09:37 AM' },
    { id: 11, type: 'camera_drift',  plate: '—',             reason: 'Camera Drift – Intermittent feed on CAM-032',      severity: 'info',     camera: 'CAM-032', location: 'Dhakuria Bridge',         timestamp: '1 hr ago',   time: '09:28 AM' },
    { id: 12, type: 'speed',         plate: 'WB 26 AE 7834', reason: 'Speed Anomaly – 78 km/h in 50 km/h corridor',      severity: 'warning',  camera: 'CAM-006', location: 'Salt Lake Sector V',      timestamp: '1.5 hrs ago', time: '09:12 AM' },
    { id: 13, type: 'wrong_dir',     plate: 'WB 55 WX 1198', reason: 'Wrong Direction – Wrong lane entry at flyover',    severity: 'warning',  camera: 'CAM-021', location: 'Ultadanga Flyover',       timestamp: '2 hrs ago',  time: '08:45 AM' },
    { id: 14, type: 'dwell',         plate: 'WB 87 YZ 3345', reason: 'Excessive Dwell – Parked in no-parking zone',      severity: 'info',     camera: 'CAM-025', location: 'Princep Ghat',            timestamp: '2.5 hrs ago', time: '08:15 AM' },
    { id: 15, type: 'blacklist',     plate: 'MH 12 AB 6690', reason: 'Blacklist Hit – Insurance expired >6 months',      severity: 'warning',  camera: 'CAM-003', location: 'Park Street Junction',    timestamp: '3 hrs ago',  time: '07:42 AM' },
];

// ===== Audit Log Data =====
export const AUDIT_LOG = [
    { id: 1,  timestamp: '14 Sep 2026, 10:34:22',  operator: 'Cdr. A. Mukherjee',   role: 'Admin',   action: 'Search',  plate: 'WB 14 CD 9021', ip: '10.0.12.45',   status: 'Success' },
    { id: 2,  timestamp: '14 Sep 2026, 10:31:08',  operator: 'Cdr. A. Mukherjee',   role: 'Admin',   action: 'Search',  plate: 'WB 26 AE 7834', ip: '10.0.12.45',   status: 'Success' },
    { id: 3,  timestamp: '14 Sep 2026, 10:28:55',  operator: 'Insp. R. Sharma',     role: 'Analyst', action: 'Export',  plate: 'WB 26 AE 7834', ip: '10.0.12.51',   status: 'Success' },
    { id: 4,  timestamp: '14 Sep 2026, 10:22:14',  operator: 'Insp. R. Sharma',     role: 'Analyst', action: 'Search',  plate: 'KA 05 MN 2213', ip: '10.0.12.51',   status: 'Success' },
    { id: 5,  timestamp: '14 Sep 2026, 10:15:33',  operator: 'SI P. Banerjee',      role: 'Viewer',  action: 'Search',  plate: 'WB 41 FG 3302', ip: '10.0.12.67',   status: 'Success' },
    { id: 6,  timestamp: '14 Sep 2026, 10:10:47',  operator: 'SI P. Banerjee',      role: 'Viewer',  action: 'Export',  plate: 'WB 41 FG 3302', ip: '10.0.12.67',   status: 'Denied' },
    { id: 7,  timestamp: '14 Sep 2026, 09:58:21',  operator: 'Cdr. A. Mukherjee',   role: 'Admin',   action: 'Flag',    plate: 'WB 14 CD 9021', ip: '10.0.12.45',   status: 'Success' },
    { id: 8,  timestamp: '14 Sep 2026, 09:45:09',  operator: 'Insp. R. Sharma',     role: 'Analyst', action: 'Search',  plate: 'DL 08 CQ 7723', ip: '10.0.12.51',   status: 'Success' },
    { id: 9,  timestamp: '14 Sep 2026, 09:33:44',  operator: 'Cdr. A. Mukherjee',   role: 'Admin',   action: 'Unflag',  plate: 'WB 87 YZ 3345', ip: '10.0.12.45',   status: 'Success' },
    { id: 10, timestamp: '14 Sep 2026, 09:28:17',  operator: 'ASI D. Roy',          role: 'Viewer',  action: 'Search',  plate: 'WB 33 PP 9914', ip: '10.0.12.73',   status: 'Success' },
    { id: 11, timestamp: '14 Sep 2026, 09:15:02',  operator: 'ASI D. Roy',          role: 'Viewer',  action: 'Search',  plate: 'MH 12 AB 6690', ip: '10.0.12.73',   status: 'Success' },
    { id: 12, timestamp: '14 Sep 2026, 09:08:39',  operator: 'Insp. R. Sharma',     role: 'Analyst', action: 'Export',  plate: 'WB 14 CD 9021', ip: '10.0.12.51',   status: 'Success' },
    { id: 13, timestamp: '14 Sep 2026, 08:55:21',  operator: 'Cdr. A. Mukherjee',   role: 'Admin',   action: 'Search',  plate: 'WB 09 HK 6678', ip: '10.0.12.45',   status: 'Success' },
    { id: 14, timestamp: '14 Sep 2026, 08:42:08',  operator: 'SI P. Banerjee',      role: 'Viewer',  action: 'Search',  plate: 'WB 72 RS 4450', ip: '10.0.12.67',   status: 'Success' },
    { id: 15, timestamp: '14 Sep 2026, 08:30:55',  operator: 'Cdr. A. Mukherjee',   role: 'Admin',   action: 'Flag',    plate: 'KA 05 MN 2213', ip: '10.0.12.45',   status: 'Success' },
    { id: 16, timestamp: '14 Sep 2026, 08:18:33',  operator: 'Insp. R. Sharma',     role: 'Analyst', action: 'Search',  plate: 'WB 55 WX 1198', ip: '10.0.12.51',   status: 'Success' },
    { id: 17, timestamp: '14 Sep 2026, 08:05:12',  operator: 'ASI D. Roy',          role: 'Viewer',  action: 'Search',  plate: 'WB 19 TU 5587', ip: '10.0.12.73',   status: 'Success' },
    { id: 18, timestamp: '14 Sep 2026, 07:52:46',  operator: 'ASI D. Roy',          role: 'Viewer',  action: 'Export',  plate: 'WB 19 TU 5587', ip: '10.0.12.73',   status: 'Denied' },
    { id: 19, timestamp: '14 Sep 2026, 07:40:28',  operator: 'Cdr. A. Mukherjee',   role: 'Admin',   action: 'Search',  plate: 'WB 02 BX 1456', ip: '10.0.12.45',   status: 'Success' },
    { id: 20, timestamp: '14 Sep 2026, 07:25:14',  operator: 'Insp. R. Sharma',     role: 'Analyst', action: 'Search',  plate: 'WB 26 AE 7834', ip: '10.0.12.51',   status: 'Success' },
];

// ===== Dashboard KPIs =====
export const DASHBOARD = {
    camerasOnline: 248,
    camerasTotal: 256,
    vehiclesTracked: 14892,
    activeAlerts: 23,
    avgOCRConfidence: 94.7,
    recentTrajectories: [
        { plate: 'WB 26 AE 7834', firstSeen: '09:14 AM', lastSeen: '10:37 AM', cameras: 7, status: 'Active' },
        { plate: 'WB 14 CD 9021', firstSeen: '08:02 AM', lastSeen: '09:45 AM', cameras: 5, status: 'Flagged' },
        { plate: 'WB 02 BX 1456', firstSeen: '10:30 AM', lastSeen: '11:15 AM', cameras: 4, status: 'Active' },
        { plate: 'KA 05 MN 2213', firstSeen: '07:55 AM', lastSeen: '10:12 AM', cameras: 8, status: 'BOLO' },
        { plate: 'WB 41 FG 3302', firstSeen: '09:22 AM', lastSeen: '10:25 AM', cameras: 3, status: 'Active' },
        { plate: 'DL 08 CQ 7723', firstSeen: '08:30 AM', lastSeen: '09:37 AM', cameras: 6, status: 'Wanted' },
    ],
    systemHealth: [
        { name: 'ANPR Engine',       status: 'Operational', icon: '⚙️' },
        { name: 'Central Server',    status: 'Operational', icon: '🖥️' },
        { name: 'Network Backbone',  status: 'Operational', icon: '🔗' },
        { name: 'Storage Cluster',   status: 'Warning',     icon: '💾' },
    ],
};

// ===== Traffic Analytics =====
export const TRAFFIC = {
    corridors: [
        { name: 'EM Bypass (North)',       avgSpeed: 48, maxSpeed: 60, congestion: 'low',    flow: 3200 },
        { name: 'EM Bypass (South)',        avgSpeed: 35, maxSpeed: 60, congestion: 'medium', flow: 4100 },
        { name: 'Park Street',             avgSpeed: 18, maxSpeed: 40, congestion: 'high',   flow: 2800 },
        { name: 'AJC Bose Road',           avgSpeed: 22, maxSpeed: 50, congestion: 'high',   flow: 3600 },
        { name: 'VIP Road',                avgSpeed: 42, maxSpeed: 60, congestion: 'low',    flow: 2900 },
        { name: 'Rashbehari Avenue',       avgSpeed: 15, maxSpeed: 40, congestion: 'high',   flow: 3100 },
        { name: 'Diamond Harbour Road',    avgSpeed: 31, maxSpeed: 50, congestion: 'medium', flow: 2400 },
        { name: 'BT Road',                 avgSpeed: 38, maxSpeed: 50, congestion: 'medium', flow: 2100 },
    ],
    hourlyVolume: [
        { hour: '06:00', volume: 1200 }, { hour: '07:00', volume: 3400 }, { hour: '08:00', volume: 5800 },
        { hour: '09:00', volume: 6200 }, { hour: '10:00', volume: 5100 }, { hour: '11:00', volume: 4300 },
        { hour: '12:00', volume: 4000 }, { hour: '13:00', volume: 3800 }, { hour: '14:00', volume: 4200 },
        { hour: '15:00', volume: 4600 }, { hour: '16:00', volume: 5400 }, { hour: '17:00', volume: 6800 },
        { hour: '18:00', volume: 7200 }, { hour: '19:00', volume: 5900 }, { hour: '20:00', volume: 4100 },
        { hour: '21:00', volume: 2800 }, { hour: '22:00', volume: 1800 },
    ],
    heatmapPoints: [], // Generated below
    originDestination: [
        { origin: 'Howrah',   destination: 'Salt Lake',   trips: 1240, avgTime: '52 min', oLat: 22.5958, oLng: 88.3425, dLat: 22.5804, dLng: 88.4169 },
        { origin: 'Dum Dum',  destination: 'Esplanade',   trips: 980,  avgTime: '41 min', oLat: 22.6227, oLng: 88.4050, dLat: 22.5636, dLng: 88.3521 },
        { origin: 'Garia',    destination: 'Park Street', trips: 870,  avgTime: '48 min', oLat: 22.4623, oLng: 88.3851, dLat: 22.5527, dLng: 88.3517 },
        { origin: 'New Town', destination: 'Central',     trips: 1120, avgTime: '38 min', oLat: 22.5923, oLng: 88.4736, dLat: 22.5636, dLng: 88.3521 },
        { origin: 'Behala',   destination: 'Sealdah',     trips: 640,  avgTime: '55 min', oLat: 22.4716, oLng: 88.3104, dLat: 22.5698, dLng: 88.3686 },
    ],
    bottlenecks: [
        // Central
        { lat: 22.5527, lng: 88.3517, name: 'Park Street Junction',    severity: 'high',   delay: '+18 min' },
        { lat: 22.5636, lng: 88.3521, name: 'Esplanade',               severity: 'high',   delay: '+15 min' },
        { lat: 22.5590, lng: 88.3530, name: 'Dharmatala',              severity: 'medium', delay: '+12 min' },
        { lat: 22.5851, lng: 88.3468, name: 'Howrah Bridge Approach',  severity: 'high',   delay: '+22 min' },
        // East
        { lat: 22.5397, lng: 88.3971, name: 'EM Bypass - Science City', severity: 'high',  delay: '+16 min' },
        { lat: 22.5142, lng: 88.3973, name: 'Ruby Hospital Junction',  severity: 'medium', delay: '+10 min' },
        { lat: 22.5698, lng: 88.3862, name: 'Sealdah Station Area',    severity: 'medium', delay: '+9 min' },
        // North
        { lat: 22.5976, lng: 88.3683, name: 'Shyambazar Five Point',   severity: 'high',   delay: '+14 min' },
        { lat: 22.6250, lng: 88.4050, name: 'Dum Dum Junction',        severity: 'medium', delay: '+8 min' },
        // South
        { lat: 22.5171, lng: 88.3685, name: 'Gariahat More',           severity: 'high',   delay: '+17 min' },
        { lat: 22.5228, lng: 88.3508, name: 'Rashbehari Crossing',     severity: 'high',   delay: '+14 min' },
        { lat: 22.4981, lng: 88.3476, name: 'Tollygunge Phari',        severity: 'medium', delay: '+9 min' },
        // Southwest
        { lat: 22.4716, lng: 88.3104, name: 'Behala Chowrasta',        severity: 'medium', delay: '+11 min' },
        { lat: 22.5086, lng: 88.3218, name: 'Diamond Harbour Road',    severity: 'medium', delay: '+8 min' },
    ],
};

// ================================================================
// Heatmap Data – Based on Kolkata traffic research (2024-2026)
// Sources: TomTom Traffic Index, Kolkata Traffic Police, JICA Study
// Intensity scale: 0.0 (empty) → 1.0 (extreme congestion)
//
// Key facts used:
//   • Howrah Bridge: ~100,000 vehicles/day (design capacity: 60,000)
//   • EM Bypass: ~8.8 lakh vehicles/month per lane at Metropolitan jn.
//   • City avg speed during peak: 13.5 km/h
//   • 23.66 lakh registered vehicles, only 6% road coverage
//   • 2,448 vehicles per km of road (among highest in India)
// ================================================================

// CENTRAL ZONE — heaviest congestion (historic core, narrow roads)
const centralHotspots = [
    // Howrah Bridge & approaches (~100k vehicles/day → intensity 1.0)
    [22.5858, 88.3465, 1.0],   // Howrah Bridge north end
    [22.5845, 88.3460, 1.0],   // Howrah Bridge mid-span
    [22.5832, 88.3458, 0.95],  // Howrah Bridge south end
    [22.5825, 88.3452, 0.9],   // Burrabazar approach
    [22.5870, 88.3475, 0.85],  // Howrah station approach road

    // Esplanade / BBD Bagh (~70k vehicles/day)
    [22.5636, 88.3521, 0.95],  // Esplanade crossing
    [22.5655, 88.3490, 0.9],   // BBD Bagh (Dalhousie Square)
    [22.5668, 88.3510, 0.85],  // Raj Bhavan gate
    [22.5620, 88.3505, 0.88],  // Chowringhee north end

    // Park Street corridor (~55k vehicles/day, extreme congestion)
    [22.5527, 88.3517, 0.95],  // Park Street × Chowringhee junction
    [22.5530, 88.3560, 0.88],  // Park Street mid (Flurys area)
    [22.5533, 88.3605, 0.8],   // Park Street × Rawdon St
    [22.5515, 88.3515, 0.85],  // Mullick Bazaar

    // AJC Bose Road / Moulali (~60k vehicles/day)
    [22.5510, 88.3450, 0.88],  // AJC Bose Road flyover
    [22.5540, 88.3480, 0.82],  // Exide crossing
    [22.5607, 88.3581, 0.85],  // Moulali crossing
    [22.5575, 88.3560, 0.8],   // Ripon Street junction

    // College Street / Sovabazar (~40k vehicles/day)
    [22.5757, 88.3617, 0.78],  // College Street
    [22.5906, 88.3604, 0.72],  // Sovabazar court
    [22.5790, 88.3590, 0.7],   // Bidhan Sarani north

    // Central Kolkata arterials
    [22.5561, 88.3361, 0.6],   // Princep Ghat
    [22.5523, 88.3323, 0.75],  // Vidyasagar Setu toll
    [22.5656, 88.3406, 0.7],   // Babughat
    [22.5401, 88.3440, 0.72],  // Rabindra Sadan
    [22.5642, 88.3681, 0.68],  // Entally market
    [22.5401, 88.3620, 0.82],  // Park Circus seven-point crossing

    // Lenin Sarani / Dharmatala
    [22.5590, 88.3530, 0.9],   // Dharmatala / Lenin Sarani junction
    [22.5570, 88.3545, 0.85],  // New Market area
    [22.5548, 88.3488, 0.78],  // Maidan edge / Red Road junction
];

// EAST ZONE — EM Bypass corridor + Salt Lake IT hub
const eastHotspots = [
    // EM Bypass — heaviest suburban artery (~30k vehicles/day per lane)
    [22.5397, 88.3971, 0.92],  // Science City junction
    [22.5142, 88.3973, 0.88],  // Ruby Hospital junction (Mandirpara)
    [22.5250, 88.3980, 0.85],  // Acropolis / Ruby connector
    [22.5480, 88.3940, 0.82],  // Chingrighata flyover
    [22.5550, 88.3900, 0.8],   // EM Bypass × Kasba connector
    [22.4900, 88.3960, 0.78],  // EM Bypass × Garia south
    [22.5700, 88.3870, 0.76],  // Beliaghata connector
    [22.5350, 88.3985, 0.84],  // Metropolitan crossing (busiest)

    // Salt Lake / Sector V IT hub (~25k vehicles during office hours)
    [22.5804, 88.4169, 0.82],  // Sector V main gate
    [22.5760, 88.4120, 0.75],  // Sector V inner roads
    [22.5720, 88.4080, 0.7],   // Sector III connector
    [22.5780, 88.4200, 0.68],  // Wipro/TCS campus area
    [22.5850, 88.4100, 0.6],   // Central Park (Salt Lake)
    [22.5680, 88.4050, 0.65],  // Karunamoyee bus stand

    // Ultadanga / Kankurgachi (~35k vehicles/day)
    [22.5833, 88.3811, 0.8],   // Ultadanga flyover
    [22.5723, 88.3834, 0.75],  // Kankurgachi junction
    [22.5672, 88.3765, 0.72],  // Phoolbagan crossing

    // Sealdah station area (~45k vehicles/day + heavy pedestrian)
    [22.5698, 88.3686, 0.88],  // Sealdah station gate
    [22.5710, 88.3700, 0.82],  // Sealdah south
    [22.5685, 88.3670, 0.78],  // APC Road approach

    // New Town / Rajarhat (~15k vehicles/day, growing)
    [22.5923, 88.4736, 0.55],  // Biswa Bangla Gate
    [22.5950, 88.4600, 0.5],   // Eco Park area
    [22.5980, 88.4500, 0.45],  // Action Area I
    [22.6050, 88.4400, 0.4],   // Nazrul Tirtha area

    // Baguiati / Lake Town
    [22.6003, 88.4134, 0.62],  // Baguiati flyover
    [22.5989, 88.3975, 0.58],  // Lake Town crossing
];

// NORTH ZONE — GT Road, Dunlop, Airport corridor
const northHotspots = [
    // Shyambazar — 5-point crossing (~50k vehicles/day, major bottleneck)
    [22.5976, 88.3683, 0.92],  // Shyambazar five-point
    [22.5990, 88.3690, 0.85],  // Shyambazar tram depot road
    [22.5960, 88.3670, 0.8],   // Hatibagan approach

    // Bagbazar / Chitpur
    [22.6021, 88.3618, 0.68],  // Bagbazar ghat
    [22.6050, 88.3650, 0.65],  // Chitpur bazaar

    // BT Road corridor (~30k vehicles/day)
    [22.6145, 88.4008, 0.72],  // Nagerbazar
    [22.6100, 88.3950, 0.68],  // Sinthee More
    [22.6200, 88.3880, 0.65],  // Baranagar approach
    [22.6300, 88.3830, 0.6],   // Belghoria flyover

    // Dunlop / Dakshineswar corridor
    [22.6389, 88.3912, 0.7],   // Dunlop bridge
    [22.6450, 88.3850, 0.55],  // Dakshineswar approach
    [22.6350, 88.3870, 0.62],  // Ariadaha junction

    // VIP Road / Airport (~25k vehicles/day)
    [22.6428, 88.4361, 0.65],  // Airport gate
    [22.6350, 88.4250, 0.6],   // VIP Road mid-section
    [22.6270, 88.4200, 0.58],  // Kaikhali
    [22.6227, 88.4199, 0.62],  // Dum Dum cantonment

    // Dum Dum junction (~40k vehicles/day)
    [22.6250, 88.4050, 0.78],  // Dum Dum junction
    [22.6200, 88.4100, 0.72],  // Jessore Road × MG Road

    // GT Road (Barrackpore)
    [22.6396, 88.3775, 0.55],  // Barrackpore GT Road
    [22.6500, 88.3700, 0.48],  // Barrackpore cantonment
    [22.6550, 88.3720, 0.42],  // Titagarh approach
];

// SOUTH ZONE — Gariahat, Tollygunge, Jadavpur, Rashbehari
const southHotspots = [
    // Gariahat More (~45k vehicles/day, chronic congestion)
    [22.5171, 88.3685, 0.92],  // Gariahat crossing
    [22.5190, 88.3700, 0.85],  // Gariahat flyover approach
    [22.5150, 88.3670, 0.82],  // Gariahat south

    // Rashbehari Avenue (~40k vehicles/day)
    [22.5228, 88.3508, 0.88],  // Rashbehari × SP Mukherjee Rd
    [22.5240, 88.3550, 0.82],  // Rashbehari mid
    [22.5250, 88.3600, 0.78],  // Rashbehari × Sarat Bose Rd

    // Ballygunge / Southern Avenue
    [22.5289, 88.3633, 0.78],  // Ballygunge Phari
    [22.5260, 88.3580, 0.72],  // Southern Avenue junction
    [22.5300, 88.3660, 0.7],   // Ballygunge station area

    // Tollygunge / Jadavpur (~35k vehicles/day)
    [22.4981, 88.3476, 0.78],  // Tollygunge Phari
    [22.4988, 88.3717, 0.72],  // Jadavpur 8B bus stand
    [22.5020, 88.3500, 0.7],   // Naktala area
    [22.4950, 88.3450, 0.65],  // Tollygunge tram depot

    // Alipore / Kalighat
    [22.5323, 88.3377, 0.6],   // Alipore Zoo gate
    [22.5212, 88.3452, 0.7],   // Kalighat bridge
    [22.5280, 88.3400, 0.65],  // Alipore court area

    // Kasba / Golpark
    [22.5172, 88.3799, 0.72],  // Kasba Golpark
    [22.5108, 88.3628, 0.65],  // Dhakuria bridge
    [22.5156, 88.3367, 0.6],   // New Alipore

    // Garia / Narendrapur
    [22.4623, 88.3851, 0.65],  // Garia station
    [22.4700, 88.3820, 0.6],   // Garia bazaar
    [22.4550, 88.3870, 0.5],   // Narendrapur
    [22.4800, 88.3780, 0.55],  // Bansdroni connector

    // Patuli / Santoshpur
    [22.4750, 88.3900, 0.52],  // Patuli crossing
    [22.4850, 88.3830, 0.48],  // Santoshpur bridge
];

// SOUTHWEST ZONE — Behala, Kidderpore, Taratala, Joka
const southwestHotspots = [
    // Behala Chowrasta (~30k vehicles/day)
    [22.4716, 88.3104, 0.78],  // Behala Chowrasta
    [22.4750, 88.3150, 0.72],  // Behala tram depot
    [22.4680, 88.3080, 0.65],  // Behala Sakher Bazar

    // Diamond Harbour Road (~25k vehicles/day)
    [22.5086, 88.3218, 0.72],  // Diamond Harbour Rd mid
    [22.4900, 88.3180, 0.65],  // DH Road × Behala connector
    [22.4800, 88.3120, 0.6],   // DH Road south

    // Kidderpore / Taratala
    [22.5325, 88.3186, 0.7],   // Kidderpore dock gate
    [22.5087, 88.3315, 0.68],  // Taratala flyover
    [22.5097, 88.3236, 0.65],  // Majerhat bridge
    [22.5200, 88.3250, 0.62],  // Alipore road approach

    // Joka / Thakurpukur
    [22.4450, 88.3060, 0.52],  // Joka tram terminus
    [22.4550, 88.3100, 0.48],  // Thakurpukur crossing
    [22.4500, 88.2980, 0.42],  // Joka–DH Road connector

    // James Long Sarani
    [22.4600, 88.3200, 0.58],  // James Long Sarani mid
    [22.4650, 88.3250, 0.55],  // JL Sarani × Behala connector
];

// Merge all zone hotspots into heatmapPoints
TRAFFIC.heatmapPoints = [
    ...centralHotspots,
    ...eastHotspots,
    ...northHotspots,
    ...southHotspots,
    ...southwestHotspots,
];

// Add spread points around each hotspot for smoother heatmap coverage
const basePoints = [...TRAFFIC.heatmapPoints];
basePoints.forEach(([lat, lng, intensity]) => {
    // Add 3-5 surrounding points at lower intensity for gradient effect
    const spread = intensity > 0.8 ? 5 : intensity > 0.6 ? 4 : 3;
    for (let j = 0; j < spread; j++) {
        TRAFFIC.heatmapPoints.push([
            lat + (Math.random() - 0.5) * 0.008,
            lng + (Math.random() - 0.5) * 0.008,
            intensity * (0.4 + Math.random() * 0.35),
        ]);
    }
});

// Add road corridor fill points (connecting major roads with medium intensity)
const corridorPoints = [
    // EM Bypass full stretch (north to south)
    ...Array.from({length: 20}, (_, i) => [22.44 + i * 0.01, 88.395 + (Math.random()-0.5)*0.005, 0.5 + Math.random()*0.25]),
    // Chowringhee Road (north-south through central)
    ...Array.from({length: 12}, (_, i) => [22.53 + i * 0.005, 88.348 + (Math.random()-0.5)*0.003, 0.55 + Math.random()*0.3]),
    // BT Road (north corridor)
    ...Array.from({length: 10}, (_, i) => [22.60 + i * 0.005, 88.385 + (Math.random()-0.5)*0.008, 0.4 + Math.random()*0.2]),
    // AJC Bose Road (east-west)
    ...Array.from({length: 10}, (_, i) => [22.551 + (Math.random()-0.5)*0.003, 88.33 + i * 0.005, 0.5 + Math.random()*0.25]),
    // Rashbehari connector to Gariahat
    ...Array.from({length: 8}, (_, i) => [22.518 + (Math.random()-0.5)*0.003, 88.35 + i * 0.003, 0.55 + Math.random()*0.2]),
    // VIP Road to Airport
    ...Array.from({length: 8}, (_, i) => [22.62 + i * 0.003, 88.40 + i * 0.005, 0.4 + Math.random()*0.2]),
];
TRAFFIC.heatmapPoints.push(...corridorPoints);

// ===== Notifications =====
export const NOTIFICATIONS = [
    { title: 'Blacklist Hit Detected', desc: 'Vehicle WB 14 CD 9021 flagged at Esplanade Crossing', time: '3 min ago' },
    { title: 'Camera Offline', desc: 'CAM-029 Lake Town Crossing went offline', time: '18 min ago' },
    { title: 'System Update', desc: 'ANPR Engine v3.2.1 deployed successfully', time: '1 hr ago' },
];

// ===== Vehicle Intelligence =====
export const VEHICLE_INTELLIGENCE = {
    'WB 26 AE 7834': {
        plate: 'WB 26 AE 7834',
        vehicleType: 'Sedan',
        color: 'Silver',
        make: 'Maruti Ciaz',
        firstSeen: '02 Sep 2026',
        lastSeen: '14 Sep 2026',
        totalSightings: 142,
        flagged: false,
        watchlist: false,
        zones: {
            'Central': 48, 'East': 35, 'South': 28, 'North': 18, 'Southwest': 13,
        },
        hourlyPattern: [0,0,0,0,0,1,3,8,14,18,22,15,11,10,12,14,16,19,12,8,4,2,1,0],
        alerts: [
            { type: 'speed', reason: 'Speed Anomaly – 87 km/h', time: '10:29 AM today', severity: 'critical' },
            { type: 'speed', reason: 'Speed Anomaly – 78 km/h', time: '09:12 AM today', severity: 'warning' },
        ],
        recentRoutes: [
            'Howrah → Esplanade → Park St → Salt Lake',
            'New Town → Ultadanga → Sealdah → Park Circus',
            'Gariahat → Ballygunge → Esplanade → Howrah',
        ],
    },
};
