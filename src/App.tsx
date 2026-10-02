import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import LiveCameras from './pages/LiveCameras';
import CameraNetwork from './pages/CameraNetwork';
import VehicleTracking from './pages/VehicleTracking';
import VehicleIntelligence from './pages/VehicleIntelligence';
import TrafficAnalytics from './pages/TrafficAnalytics';
import AnomalyDetection from './pages/AnomalyDetection';
import Alerts from './pages/Alerts';
import AuditLog from './pages/AuditLog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="live-cameras" element={<LiveCameras />} />
          <Route path="camera-network" element={<CameraNetwork />} />
          <Route path="vehicle-tracking" element={<VehicleTracking />} />
          <Route path="vehicle-intelligence" element={<VehicleIntelligence />} />
          <Route path="traffic-analytics" element={<TrafficAnalytics />} />
          <Route path="anomaly-detection" element={<AnomalyDetection />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="audit-log" element={<AuditLog />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
