import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { NOTIFICATIONS } from '../data';

const Layout = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('eagleeye-theme') || 'light';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchPlate, setSearchPlate] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eagleeye-theme', theme);
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const plate = searchPlate.trim().toUpperCase();
      if (plate) {
        navigate(`/vehicle-tracking?plate=${plate}`);
        setSearchPlate('');
      }
    }
  };

  return (
    <div className="app-shell" onClick={() => setShowNotifications(false)}>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2"/>
                <circle cx="14" cy="14" r="5" fill="currentColor"/>
                <line x1="14" y1="0" x2="14" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="14" y1="22" x2="14" y2="28" stroke="currentColor" strokeWidth="2"/>
                <line x1="0" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="2"/>
                <line x1="22" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-name">EagleEye</span>
              <span className="logo-tagline">City Traffic Intelligence</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">OVERVIEW</span>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
              <span>Dashboard</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">MONITOR</span>
            <NavLink to="/live-cameras" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 7.5L17 5.5V12.5L13 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Live Cameras</span>
            </NavLink>
            <NavLink to="/camera-network" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="3" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="15" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7.5 6L4.5 12M10.5 6L13.5 12M5.5 14H12.5" stroke="currentColor" strokeWidth="1.2"/></svg>
              <span>Camera Network</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">INTELLIGENCE</span>
            <NavLink to="/vehicle-tracking" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/><line x1="9" y1="0.5" x2="9" y2="4" stroke="currentColor" strokeWidth="1.5"/><line x1="9" y1="14" x2="9" y2="17.5" stroke="currentColor" strokeWidth="1.5"/><line x1="0.5" y1="9" x2="4" y2="9" stroke="currentColor" strokeWidth="1.5"/><line x1="14" y1="9" x2="17.5" y2="9" stroke="currentColor" strokeWidth="1.5"/></svg>
              <span>Vehicle Tracking</span>
            </NavLink>
            <NavLink to="/vehicle-intelligence" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="10" width="14" height="5" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="5.5" cy="15" r="1.5" stroke="currentColor" strokeWidth="1"/><circle cx="12.5" cy="15" r="1.5" stroke="currentColor" strokeWidth="1"/><path d="M4 10V8C4 6 5 4 9 3C13 4 14 6 14 8V10" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="4" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M13 4H15M14 3V5" stroke="currentColor" strokeWidth="1"/></svg>
              <span>Vehicle Intelligence</span>
            </NavLink>
            <NavLink to="/traffic-analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="10" width="3" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="5.5" y="7" width="3" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="10" y="3" width="3" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="14.5" y="1" width="3" height="16" rx="0.5" stroke="currentColor" strokeWidth="1.3"/></svg>
              <span>Traffic Analytics</span>
            </NavLink>
            <NavLink to="/anomaly-detection" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L9 4.5M9 13.5L9 16.5M2.5 9L5.5 9M12.5 9L15.5 9M4.2 4.2L6.3 6.3M11.7 11.7L13.8 13.8M4.2 13.8L6.3 11.7M11.7 6.3L13.8 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>
              <span>Anomaly Detection</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">OPERATIONS</span>
            <NavLink to="/alerts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L1.5 14.5H16.5L9 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><line x1="9" y1="7" x2="9" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="12.5" r="0.75" fill="currentColor"/></svg>
              <span>Alerts</span>
              <span className="nav-badge">23</span>
            </NavLink>
            <NavLink to="/audit-log" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="1" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="5" x2="12" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="6" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="6" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <span>Audit Log</span>
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-status">
            <span className="status-dot online"></span>
            <span>System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" aria-label="Open sidebar" onClick={() => setIsSidebarOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
            <h1 className="page-title">EAGLEEYE INTELLIGENCE</h1>
          </div>
          
          <div className="topbar-center">
            <span className="status-dot online"></span>
            <span className="network-status">KOLKATA URBAN NETWORK&ensp;•&ensp;248 / 256 CAMERAS ONLINE</span>
          </div>

          <div className="topbar-right">
            <div className="search-global">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <input 
                type="text" 
                placeholder="Search plate..." 
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <button 
                className="topbar-icon-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 7C4 4.23858 6.23858 2 9 2C11.7614 2 14 4.23858 14 7V11L15.5 13H2.5L4 11V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 14C7 15.1046 7.89543 16 9 16C10.1046 16 11 15.1046 11 14" stroke="currentColor" strokeWidth="1.5"/></svg>
                <span className="notif-badge">3</span>
              </button>
              
              {showNotifications && (
                <div className="notif-dropdown active" style={{ position: 'absolute', top: '100%', right: '0', zIndex: 1000 }} onClick={e => e.stopPropagation()}>
                    <div className="notif-header">Notifications</div>
                    <div className="notif-list">
                        {NOTIFICATIONS.map((n, i) => (
                            <div className="notif-item" key={i}>
                                <div className="notif-item-title">{n.title}</div>
                                <div className="notif-item-desc">{n.desc}</div>
                                <div className="notif-item-time">{n.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              <svg className="icon-sun" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M9 1V3M9 15V17M1 9H3M15 9H17M3.5 3.5L5 5M13 13L14.5 14.5M14.5 3.5L13 5M5 13L3.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg className="icon-moon" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15.5 10.5C14.0913 12.7969 11.5 14 8.5 14C4.35786 14 1 10.6421 1 6.5C1 4.33333 2 2 3.5 1C2.83333 3.16667 3.2 7.8 7 10C10.8 12.2 14.3333 11.3333 15.5 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </button>
            <div className="user-avatar" title="Cdr. A. Mukherjee">AM</div>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>

        <footer className="footer-bar">
          <div className="footer-left">
            <span className="status-dot online"></span>
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
          <span className="footer-operator">Operator: Cdr. A. Mukherjee</span>
          <span className="footer-version">EagleEye v2.4.1 (React)</span>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
