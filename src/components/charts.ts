/* ============================================================
   EagleEye – Shared Chart.js Helpers – React Version
   ============================================================ */

declare const Chart: any;

function getChartColors() {
    const style = getComputedStyle(document.documentElement);
    return {
        text:       style.getPropertyValue('--text-secondary').trim() || '#6b7280',
        textLight:  style.getPropertyValue('--text-tertiary').trim() || '#9ca3af',
        grid:       style.getPropertyValue('--border-light').trim() || '#f0f1f3',
        accent:     style.getPropertyValue('--accent').trim() || '#2563eb',
        success:    style.getPropertyValue('--success').trim() || '#059669',
        warning:    style.getPropertyValue('--warning').trim() || '#d97706',
        danger:     style.getPropertyValue('--danger').trim() || '#dc2626',
        bg:         style.getPropertyValue('--bg-card').trim() || '#ffffff',
    };
}

function getDefaults() {
    const c = getChartColors();
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: c.bg,
                titleColor: c.text,
                bodyColor: c.text,
                borderColor: c.grid,
                borderWidth: 1,
                cornerRadius: 6,
                padding: 10,
                titleFont: { family: "'Inter', sans-serif", size: 12, weight: '600' },
                bodyFont: { family: "'Inter', sans-serif", size: 12 },
            },
        },
        scales: {
            x: {
                grid: { color: c.grid, drawBorder: false },
                ticks: { color: c.textLight, font: { family: "'Inter', sans-serif", size: 11 } },
                border: { display: false },
            },
            y: {
                grid: { color: c.grid, drawBorder: false },
                ticks: { color: c.textLight, font: { family: "'Inter', sans-serif", size: 11 } },
                border: { display: false },
            },
        },
    };
}

const activeCharts = new Map<string, any>();

export function createLineChart(canvasId: string, labels: string[], data: number[], options: any = {}) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return null;

    if (activeCharts.has(canvasId)) {
        activeCharts.get(canvasId).destroy();
    }

    const c = getChartColors();
    const defaults = getDefaults();

    const chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: options.label || 'Value',
                data,
                borderColor: options.color || c.accent,
                backgroundColor: (options.color || c.accent) + '18',
                borderWidth: 2,
                fill: options.fill !== false,
                tension: 0.4,
                pointRadius: options.showPoints ? 4 : 0,
                pointHoverRadius: 6,
                pointBackgroundColor: options.color || c.accent,
            }],
        },
        options: {
            ...defaults,
            ...options.chartOptions,
        },
    });

    activeCharts.set(canvasId, chart);
    return chart;
}

export function createHorizontalBarChart(canvasId: string, labels: string[], data: number[], colors: string[], options: any = {}) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return null;

    if (activeCharts.has(canvasId)) {
        activeCharts.get(canvasId).destroy();
    }

    const defaults = getDefaults();

    const chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: options.label || 'Value',
                data,
                backgroundColor: colors,
                borderRadius: 4,
                borderSkipped: false,
                barThickness: options.barThickness || 18,
            }],
        },
        options: {
            ...defaults,
            indexAxis: 'y',
            scales: {
                ...defaults.scales,
                x: {
                    ...defaults.scales.x,
                    max: options.max || undefined,
                },
            },
            ...options.chartOptions,
        },
    });

    activeCharts.set(canvasId, chart);
    return chart;
}

export function createBarChart(canvasId: string, labels: string[], data: number[], options: any = {}) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return null;

    if (activeCharts.has(canvasId)) {
        activeCharts.get(canvasId).destroy();
    }

    const c = getChartColors();
    const defaults = getDefaults();

    const chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: options.label || 'Value',
                data,
                backgroundColor: options.color || c.accent + '80',
                borderColor: options.color || c.accent,
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            }],
        },
        options: {
            ...defaults,
            ...options.chartOptions,
        },
    });

    activeCharts.set(canvasId, chart);
    return chart;
}

export function createDoughnutChart(canvasId: string, labels: string[], data: number[], colors: string[], options: any = {}) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return null;

    if (activeCharts.has(canvasId)) {
        activeCharts.get(canvasId).destroy();
    }

    const chart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderWidth: 0,
                spacing: 2,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: options.cutout || '70%',
            plugins: {
                legend: { display: options.showLegend || false },
                tooltip: getDefaults().plugins.tooltip,
            },
        },
    });

    activeCharts.set(canvasId, chart);
    return chart;
}

export function destroyChart(canvasId: string) {
    if (activeCharts.has(canvasId)) {
        activeCharts.get(canvasId).destroy();
        activeCharts.delete(canvasId);
    }
}
