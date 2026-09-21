import { ANOMALY_DATABASE } from '../data.js';

export function render(params) {
    return `
    <style>
        .plate-box {
            width: 44px;
            height: 52px;
            text-align: center;
            font-size: 1.5rem;
            font-family: monospace;
            font-weight: bold;
            text-transform: uppercase;
            border: 2px solid var(--border-color, #e5e7eb);
            border-radius: 6px;
            background: var(--bg-card);
            color: var(--text-primary);
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .plate-box:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .space-divider { width: 12px; }
    </style>
    <div class="page">
        <div class="page-header mb-20">
            <h1 class="page-header-title text-2xl font-bold">Anomaly Detection / Partial Plate Search</h1>
            <p class="text-secondary mt-8">Enter known parts of the vehicle plate. Leave boxes empty for unknown characters.</p>
        </div>

        <div class="card panel border rounded mb-20">
            <div class="card-body panel-body p-20 flex flex-col gap-16" style="display: flex; flex-direction: column; gap: 1rem;">
                <div class="text-sm text-secondary font-medium uppercase tracking-wider">Plate Segments</div>
                
                <div class="flex items-center flex-wrap" id="plateInputsContainer" style="display: flex; align-items: center;">
                    <!-- State Code (2) -->
                    <input type="text" class="plate-box" maxlength="1" data-index="0" placeholder="_">
                    <input type="text" class="plate-box ml-4" style="margin-left: 4px;" maxlength="1" data-index="1" placeholder="_">
                    
                    <div class="space-divider"></div>
                    
                    <!-- RTO Code (2) -->
                    <input type="text" class="plate-box" maxlength="1" data-index="2" placeholder="_">
                    <input type="text" class="plate-box ml-4" style="margin-left: 4px;" maxlength="1" data-index="3" placeholder="_">
                    
                    <div class="space-divider"></div>
                    
                    <!-- Series (2) -->
                    <input type="text" class="plate-box" maxlength="1" data-index="4" placeholder="_">
                    <input type="text" class="plate-box ml-4" style="margin-left: 4px;" maxlength="1" data-index="5" placeholder="_">
                    
                    <div class="space-divider"></div>
                    
                    <!-- Number (4) -->
                    <input type="text" class="plate-box" maxlength="1" data-index="6" placeholder="_">
                    <input type="text" class="plate-box ml-4" style="margin-left: 4px;" maxlength="1" data-index="7" placeholder="_">
                    <input type="text" class="plate-box ml-4" style="margin-left: 4px;" maxlength="1" data-index="8" placeholder="_">
                    <input type="text" class="plate-box ml-4" style="margin-left: 4px;" maxlength="1" data-index="9" placeholder="_">
                </div>
                
                <div class="flex justify-between items-center mt-8 border-t pt-16" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color, #e5e7eb); padding-top: 1rem;">
                    <div class="text-lg font-medium">Live Preview: <span id="platePreview" class="mono text-primary font-bold tracking-widest ml-8" style="margin-left: 0.5rem; letter-spacing: 0.1em;">__ __ __ ____</span></div>
                    <button id="searchPartialBtn" class="btn btn-primary" style="padding: 10px 24px; font-weight: 600; border-radius: 8px;">Search Database</button>
                </div>
            </div>
        </div>

        <div class="results-container">
            <h3 class="text-lg font-semibold mb-12">Suggested Matches</h3>
            <div id="anomalyResultsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
                <div class="text-secondary" style="grid-column: 1 / -1;">Enter a partial plate to search.</div>
            </div>
        </div>
    </div>
    `;
}

export function init(params) {
    const inputs = Array.from(document.querySelectorAll('.plate-box'));
    const preview = document.getElementById('platePreview');
    const searchBtn = document.getElementById('searchPartialBtn');
    const resultsGrid = document.getElementById('anomalyResultsGrid');

    function updatePreview() {
        const vals = inputs.map(input => input.value.toUpperCase() || '_');
        const state = vals.slice(0,2).join('');
        const rto = vals.slice(2,4).join('');
        const series = vals.slice(4,6).join('');
        const number = vals.slice(6,10).join('');
        
        preview.textContent = `${state} ${rto} ${series} ${number}`;
    }

    // Handle Input Navigation
    inputs.forEach((input, index) => {
        // Auto-capitalize on input
        input.addEventListener('input', (e) => {
            let val = input.value.toUpperCase();
            
            // Allow letters in first 2 (State) and series (index 4, 5)
            // Allow digits in RTO (index 2, 3) and number (index 6, 7, 8, 9)
            if (index < 2 || (index >= 4 && index < 6)) {
                val = val.replace(/[^A-Z]/g, '');
            } else {
                val = val.replace(/[^0-9]/g, '');
            }
            
            input.value = val;
            updatePreview();

            if (val && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Handle Backspace & Arrows
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                inputs[index - 1].focus();
            } else if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
                e.preventDefault();
            } else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
                e.preventDefault();
            } else if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Focus selection
        input.addEventListener('focus', () => {
            input.select();
        });
    });

    function performSearch() {
        const vals = inputs.map(input => input.value.toUpperCase() || '.');
        
        // If everything is empty (all '.')
        if (vals.every(v => v === '.')) {
            resultsGrid.innerHTML = '<div class="text-secondary" style="grid-column: 1 / -1;">Please enter at least one character to search.</div>';
            return;
        }

        const regexStr = vals.join('');
        let regex;
        try {
            regex = new RegExp(`^${regexStr}$`, 'i');
        } catch (e) {
            resultsGrid.innerHTML = '<div class="text-danger" style="grid-column: 1 / -1;">Invalid search pattern.</div>';
            return;
        }

        // Search the mocked database
        const matches = ANOMALY_DATABASE.filter(v => {
            const plateNoSpaces = v.plate.replace(/\s+/g, '');
            return regex.test(plateNoSpaces);
        });

        if (matches.length === 0) {
            resultsGrid.innerHTML = '<div class="text-secondary" style="grid-column: 1 / -1;">No matching vehicles found. Try adjusting your search pattern.</div>';
            return;
        }

        // Render matches
        resultsGrid.innerHTML = matches.map(m => `
            <div class="card border rounded p-16 flex flex-col gap-8 anomaly-result-card" style="border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 0.75rem; background: var(--bg-card); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" data-plate="${m.plate}">
                <div class="flex justify-between items-center" style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="text-xl font-bold mono text-primary">${m.plate}</div>
                    <span class="badge badge-info text-xs">${m.registrationType || 'Personal'}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                    <div><span class="text-secondary text-xs uppercase">Type</span><br><b>${m.vehicleType}</b></div>
                    <div><span class="text-secondary text-xs uppercase">Make</span><br><b>${m.make}</b></div>
                    <div><span class="text-secondary text-xs uppercase">Color</span><br><b>${m.color}</b></div>
                    <div><span class="text-secondary text-xs uppercase">Fuel</span><br><b>${m.fuelType}</b></div>
                </div>
                <button class="btn btn-secondary btn-sm mt-8 w-full" style="margin-top: 8px; width: 100%;">View Intelligence &rarr;</button>
            </div>
        `).join('');

        // Add click events to redirect to vehicle-intelligence
        document.querySelectorAll('.anomaly-result-card').forEach(card => {
            card.addEventListener('click', () => {
                const plate = card.dataset.plate;
                if (window.navigateTo) {
                    window.navigateTo('vehicle-intelligence', { plate });
                }
            });
            // Hover effect
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'none';
                card.style.boxShadow = 'none';
            });
        });
    }

    searchBtn.addEventListener('click', performSearch);
    
    // Focus first input on load
    setTimeout(() => {
        if (inputs[0]) inputs[0].focus();
    }, 100);
}
