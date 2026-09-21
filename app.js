/* ============================================================
   EagleEye – App Router, Theme Toggle, Shell Logic
   ============================================================ */

import { NOTIFICATIONS } from './data.js';

// ===== Page Modules (lazy-ish imports) =====
import { render as renderDashboard, init as initDashboard }               from './pages/dashboard.js';
import { render as renderLiveCameras, init as initLiveCameras }           from './pages/live-cameras.js';
import { render as renderCameraNetwork, init as initCameraNetwork }       from './pages/camera-network.js';
import { render as renderVehicleTracking, init as initVehicleTracking }   from './pages/vehicle-tracking.js';
import { render as renderVehicleIntelligence, init as initVehicleIntelligence } from './pages/vehicle-intelligence.js';
import { render as renderTrafficAnalytics, init as initTrafficAnalytics } from './pages/traffic-analytics.js';
import { render as renderAlerts, init as initAlerts }                     from './pages/alerts.js';
import { render as renderAuditLog, init as initAuditLog }                 from './pages/audit-log.js';

// ===== Routes =====
const routes = {
    'dashboard':            { title: 'DASHBOARD',            render: renderDashboard,          init: initDashboard },
    'live-cameras':         { title: 'LIVE CAMERAS',         render: renderLiveCameras,        init: initLiveCameras },
    'camera-network':       { title: 'CAMERA NETWORK',       render: renderCameraNetwork,      init: initCameraNetwork },
    'vehicle-tracking':     { title: 'VEHICLE TRACKING',     render: renderVehicleTracking,    init: initVehicleTracking },
    'vehicle-intelligence': { title: 'VEHICLE INTELLIGENCE', render: renderVehicleIntelligence, init: initVehicleIntelligence },
    'traffic-analytics':    { title: 'TRAFFIC ANALYTICS',    render: renderTrafficAnalytics,   init: initTrafficAnalytics },
    'alerts':               { title: 'ALERTS',               render: renderAlerts,             init: initAlerts },
    'audit-log':            { title: 'AUDIT LOG',            render: renderAuditLog,           init: initAuditLog },
};

let currentPage = null;

// ===== Navigation =====
function navigate(page, params = {}) {
    const route = routes[page];
    if (!route) return navigate('dashboard');

    currentPage = page;

    // Update page title
    document.getElementById('pageTitle').textContent = route.title;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // Render page content
    const main = document.getElementById('mainContent');
    main.innerHTML = route.render(params);
    main.scrollTop = 0;

    // Add enter animation
    const pageEl = main.querySelector('.page');
    if (pageEl) pageEl.classList.add('page-enter');

    // Initialize page (maps, charts, event listeners)
    if (route.init) {
        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => route.init(params));
    }

    // Update hash
    if (window.location.hash !== `#${page}`) {
        history.pushState(null, '', `#${page}`);
    }

    // Close mobile sidebar
    closeSidebar();
}

// Make navigate available globally for cross-page navigation
window.navigateTo = navigate;

// ===== Hash-based Routing =====
function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'vehicle-tracking';
    const [page, ...paramParts] = hash.split('?');
    const params = {};
    if (paramParts.length) {
        new URLSearchParams(paramParts.join('?')).forEach((v, k) => { params[k] = v; });
    }
    navigate(page, params);
}

window.addEventListener('hashchange', handleHashChange);

// ===== Theme Toggle =====
function initTheme() {
    const saved = localStorage.getItem('eagleeye-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('eagleeye-theme', next);

    // Dispatch event for map tile updates
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: next } }));
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// ===== Sidebar Mobile Toggle =====
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mobileOverlay');

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

document.getElementById('hamburger').addEventListener('click', openSidebar);
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// ===== Sidebar Nav Links =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) navigate(page);
    });
});

// ===== Global Search =====
const globalSearch = document.getElementById('globalSearch');
globalSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const plate = globalSearch.value.trim().toUpperCase();
        if (plate) {
            navigate('vehicle-tracking', { plate });
            globalSearch.value = '';
        }
    }
});

// ===== Notification Dropdown =====
const notifBtn = document.getElementById('notifBtn');
let notifDropdown = null;

notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (notifDropdown) {
        notifDropdown.remove();
        notifDropdown = null;
        return;
    }

    notifDropdown = document.createElement('div');
    notifDropdown.className = 'notif-dropdown active';
    notifDropdown.innerHTML = `
        <div class="notif-header">Notifications</div>
        <div class="notif-list">
            ${NOTIFICATIONS.map(n => `
                <div class="notif-item">
                    <div class="notif-item-title">${n.title}</div>
                    <div class="notif-item-desc">${n.desc}</div>
                    <div class="notif-item-time">${n.time}</div>
                </div>
            `).join('')}
        </div>
    `;

    // Position relative to the topbar
    const topbar = document.getElementById('topbar');
    topbar.style.position = 'relative';
    topbar.appendChild(notifDropdown);
});

document.addEventListener('click', () => {
    if (notifDropdown) {
        notifDropdown.remove();
        notifDropdown = null;
    }
});

// ===== Initialize =====
initTheme();
handleHashChange();
