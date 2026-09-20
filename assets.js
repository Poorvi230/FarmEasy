const overviewGrid = document.getElementById('asset-overview-grid');                                                                                                                                               
const assetSubViews = document.querySelectorAll('.asset-subview');                                                                                                                                                 
const clickableCards = document.querySelectorAll('.asset-clickable');                                                                                                                                              
const backButtons = document.querySelectorAll('.back-to-assets-btn');

clickableCards.forEach(card => {
    card.addEventListener('click', () => {
        const targetViewId = card.getAttribute('data-view');
        const targetView = document.getElementById(targetViewId);
        if (targetView && overviewGrid) {
            overviewGrid.classList.add('hidden');
            assetSubViews.forEach(v => v.classList.add('hidden'));
            targetView.classList.remove('hidden');
        }
    });
});

backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        assetSubViews.forEach(v => v.classList.add('hidden'));
        if (overviewGrid) overviewGrid.classList.remove('hidden');
        renderAssetsOverview();
    });
});

const defaultFleet = [
    {
        id: "big-john",                                                                                                                                                                                            
            name: "Big John",                                                                                                                                                                                          
            model: "John Deere 8R 370",                                                                                                                                                                                
            type: "Tractor",                                                                                                                                                                                           
            icon: "🚜",                                                                                                                                                                                                
            totalHours: 1425,                                                                                                                                                                                          
            hoursSinceService: 225,                                                                                                                                                                                    
            serviceInterval: 250,                                                                                                                                                                                      
            oilStatus: "Good",                                                                                                                                                                                         
            notes: "Primary tillage and center-pivot hauler" 
    },
    {                                                                                                                                                                                                              
            id: "old-rustus",                                                                                                                                                                                          
            name: "Old Rustus",                                                                                                                                                                                        
            model: "Case IH Magnum 7120",                                                                                                                                                                              
            type: "Tractor",                                                                                                                                                                                           
            icon: "🚜",                                                                                                                                                                                                
            totalHours: 4890,                                                                                                                                                                                          
            hoursSinceService: 265, // Overdue by 15 hours                                                                                                                                                             
            serviceInterval: 250,                                                                                                                                                                                      
            oilStatus: "Needs Oil",                                                                                                                                                                                    
            notes: "Secondary yard tractor & manure spreader"                                                                                                                                                          
        },                                                                                                                                                                                                             
        {                                                                                                                                                                                                              
            id: "the-reaper",                                                                                                                                                                                          
            name: "The Reaper",                                                                                                                                                                                        
            model: "Claas Lexion 760 Combine",                                                                                                                                                                         
            type: "Harvester",                                                                                                                                                                                         
            icon: "🌾",                                                                                                                                                                                                
            totalHours: 840,                                                                                                                                                                                           
            hoursSinceService: 110,                                                                                                                                                                                    
            serviceInterval: 250,                                                                                                                                                                                      
            oilStatus: "Good",                                                                                                                                                                                         
            notes: "Stored in West Barn. Scheduled for corn harvest"                                                                                                                                                   
        } 
];

let fleet = JSON.parse(localStorage.getItem('farmeasy_fleet')) || defaultFleet;                                                                                                                                    
let activeMachineForLog = null;

const fleetContainer = document.getElementById('machinery-cards-container');                                                                                                                                       
const fleetModal = document.getElementById('machine-log-modal');                                                                                                                                                   
const modalMachineTitle = document.getElementById('modal-machine-name');                                                                                                                                           
const hoursToAddInput = document.getElementById('hours-to-add-input');                                                                                                                                             
const markServicedCheckbox = document.getElementById('mark-serviced-check');                                                                                                                                       
const saveMachineBtn = document.getElementById('save-machine-log-btn');                                                                                                                                            
const cancelMachineBtn = document.getElementById('cancel-machine-log-btn');                                                                                                                                        

function saveFleet() {
    localStorage.setItem('farmeasy_fleet', JSON.stringify(fleet));
    const rustus = fleet.find(m => m.id === 'old-rustus');
    if (rustus) {
        const isRustusServiced = rustus.hoursSinceService < rustus.serviceInterval;
        localStorage.setItem('farmeasy_rustus_serviced', isRustusServiced ? 'true' : 'false');
    }
}

function renderFleet() {
    if (!fleetContainer) return;
    fleetContainer.innerHTML = '';

    fleet.forEach(machine => {
        const isOverdue = machine.hoursSinceService >= machine.serviceInterval;
        const percent = Math.min(100, Math.round((machine.hoursSinceService / machine.serviceInterval) * 100));

        let statusClass = "healthy";
        let statusLabel = "Ready for Duty";
        let barColorClass = "bar-good";

        if (isOverdue) {
            statusClass = "warning";
            statusLabel = `Service Overdue (+${machine.hoursSinceService - machine.serviceInterval} hrs)`; 
            barColorClass = "bar-overdue";
        } else if (percent >= 80) {
            statusClass = "caution";
            statusLabel = "Service Approaching";
            barColorClass = "bar-caution";
        }

        const slide = document.createElement('div');
        slide.className = 'machine-slide';
        slide.innerHTML = `                                                                                                                                                                                        
                <div class="img-placeholder">${machine.icon}<br>${machine.type}</div>                                                                                                                                  
                <div class="machine-info">                                                                                                                                                                             
                    <h3>${machine.name}</h3>                                                                                                                                                                           
                    <p class="model-subtext">${machine.model}</p>                                                                                                                                                      
                    <p class="status ${statusClass}">${statusLabel}</p>                                                                                                                                                
                                                                                                                                                                                                                       
                    <div class="tach-telemetry-box">                                                                                                                                                                   
                        <div class="tach-row">                                                                                                                                                                         
                            <span>Total Tach Hours:</span>                                                                                                                                                             
                            <strong>${machine.totalHours.toLocaleString()} hrs</strong>                                                                                                                                
                        </div>                                                                                                                                                                                         
                        <div class="tach-row">                                                                                                                                                                         
                            <span>Oil Service Interval:</span>                                                                                                                                                         
                            <strong>${machine.hoursSinceService} / ${machine.serviceInterval} hrs</strong>                                                                                                             
                        </div>                                                                                                                                                                                         
                        <div class="service-bar-bg">                                                                                                                                                                   
                            <div class="service-bar-fill ${barColorClass}" style="width: ${percent}%;"></div>                                                                                                          
                        </div>                                                                                                                                                                                         
                    </div>                                                                                                                                                                                             
                                                                                                                                                                                                                       
                    <small class="machine-notes">${machine.notes}</small>                                                                                                                                              
                                                                                                                                                                                                                       
                    <div class="machine-actions-row">                                                                                                                                                                  
                        <button class="btn-primary log-hours-btn" data-id="${machine.id}" style="font-size: 0.8rem; padding: 7px 14px; width: 100%;">                                                                  
                            ⚙️ Log Hours & Service                                                                                                                                                                     
                        </button>                                                                                                                                                                                      
                    </div>                                                                                                                                                                                             
                </div>                                                                                                                                                                                                 
            `;
        fleetContainer.appendChild(slide);
    });
    renderAssetsOverview(); 
}

if (fleetContainer) {
    fleetContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.log-hours-btn');
        if (!btn) return;
        const machineId = btn.getAttribute('data-id');
        activeMachineForLog = fleet.find(m => m.id === machineId);
        if (!activeMachineForLog) return;

        if (modalMachineTitle) modalMachineTitle.innerText = `${activeMachineForLog.name} (${activeMachineForLog.model})`;
        if (hoursToAddInput) {
            hoursToAddInput.value = '';
            setTimeout(() => hoursToAddInput.focus(), 60);
        }
        if (markServicedCheckbox) markServicedCheckbox.checked = false;
        if (fleetModal) fleetModal.classList.remove('hidden');
    });
}

if (saveMachineBtn) {
    saveMachineBtn.addEventListener('click', (e) => {
        if (!activeMachineForLog) return;
        const addHours = parseFloat(hoursToAddInput ? hoursToAddInput.value : 0) || 0;
        const performService = markServicedCheckbox ? markServicedCheckbox.checked : false;

        if (addHours > 0) {
            activeMachineForLog.totalHours += addHours;
            activeMachineForLog.hoursSinceService += addHours;
        }

        if (performService) {
            activeMachineForLog.hoursSinceService = 0;
            activeMachineForLog.notes = `Last serviced at ${activeMachineForLog.totalHours} hrs (Fresh oil & filter change)`;
        }

        saveFleet();
        renderFleet();
        if (fleetModal) fleetModal.classList.add('hidden');

        if (window.spawnFloatingText) {
            window.spawnFloatingText(e, performService ? "✅ Oil Serviced!" : `+${addHours} hrs`);
        }
    });
}

if (hoursToAddInput) {
    hoursToAddInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (saveMachineBtn) saveMachineBtn.click();
        }
    });
}

if (cancelMachineBtn) {
    cancelMachineBtn.addEventListener('click', () => {
        if (fleetModal) fleetModal.classList.add('hidden');
    });
}

if (fleetModal) {
    fleetModal.addEventListener('click', (e) => {
        if (e.target === fleetModal) fleetModal.classList.add('hidden');
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fleetModal && !fleetModal.classList.contains('hidden')) {
        fleetModal.classList.add('hidden');
    }
});

let siloState = JSON.parse(localStorage.getItem('farmeasy_silo_state')) || {
    storedCrops: "Yellow Dent Corn",
    bushels: 4625,
    moisturePercent: 14.8,
    coreTempF: 72,
    fanRunning: false
};

const siloMoistureEl = document.getElementById('silo-moisture-val');                                                                                                                                               
const siloTempEl = document.getElementById('silo-temp-val');                                                                                                                                                       
const siloBadgeEl = document.getElementById('silo-status-badge');                                                                                                                                                  
const siloFanBtn = document.getElementById('toggle-fan-btn');                                                                                                                                                      
const siloFanStatusEl = document.getElementById('fan-running-indicator');
let fanInterval = null;

function saveSilo() {
    localStorage.setItem('farmeasy_silo_state', JSON.stringify(siloState));
}
function updateSiloUI() {
    if (!siloMoistureEl) return;

    siloMoistureEl.innerText = `${siloState.moisturePercent.toFixed(1)}%`;
    if (siloTempEl) siloTempEl.innerText = `${siloState.coreTempF}°F`;

    if (siloBadgeEl) {
        if (siloState.moisturePercent <= 14) {
            siloBadgeEl.className = "facility-badge healthy";
            siloBadgeEl.innerText = "Safe Storage (<14%)";
        } else if (siloState.moisturePercent <= 15.0) {
            siloBadgeEl.className = "facility-badge warning";
            siloBadgeEl.innerText = "Elevated Moisture (Run Fan)";
        } else {
            siloBadgeEl.className = "facility-badge danger";
            siloBadgeEl.innerText = "Critical Spoilage Risk";
        }
    }

    if (siloFanBtn) {
        siloFanBtn.innerText = siloState.fanRunning ? "🛑 Stop Aeration Fan" : "🌀 Turn On Aeration Fan";
        siloFanBtn.className = siloState.fanRunning ? "btn-primary fan-active-btn" : "btn-secondary";
    }

    if (siloFanStatusEl) {
        siloFanStatusEl.innerHTML = siloState.fanRunning
            ? `<span class="fan-spinning">🌀</span> Airflow Active: Drying grain core (-0.1%/sec)`                                                                                                                 
            : `Aeration Fan is Off`;   
    }
}

function toggleAerationFan() {
    siloState.fanRunning = !siloState.fanRunning;
    saveSilo();
    updateSiloUI();

    if (siloState.fanRunning) {
        if (fanInterval) clearInterval(fanInterval);
        fanInterval = setInterval(() => {
            if (siloState.moisturePercent > 13.2) {
                siloState.moisturePercent = Math.max(13.2, siloState.moisturePercent - 0.1);
            }
            if (siloState.coreTempF > 62) {
                siloState.coreTempF -= 1;
            }
            saveSilo();
            updateSiloUI();

            if (siloState.moisturePercent <= 13.2 && siloState.coreTempF <= 62) {
                siloState.fanRunning = false;
                clearInterval(fanInterval);
                saveSilo();
                updateSiloUI();
            }
        }, 1200);
    } else {
        if (fanInterval) clearInterval(fanInterval);
    }
}

if (siloFanBtn) {
    siloFanBtn.addEventListener('click', toggleAerationFan);
}

const defaultFeedStock = [
    { id: 'wheat', name: 'Winter Wheat Seed', icon: '🌾', current: 14, max: 30, unit: 'bags' },                                                                                                                    
    { id: 'corn', name: 'Dent Corn Seed', icon: '🌽', current: 4, max: 25, unit: 'sacks' },                                                                                                                        
    { id: 'fertilizer', name: '46-0-0 Urea Fertilizer', icon: '🧪', current: 18, max: 20, unit: 'bags' },                                                                                                          
    { id: 'chicken', name: 'Layer Hen Mash', icon: '🪱', current: 8, max: 15, unit: 'bags' }                                                                                                                       
];

let feedStock = JSON.parse(localStorage.getItem('farmeasy_feed_stock')) || defaultFeedStock;
const feedContainer = document.getElementById('feed-inventory-container');
const feedSummary = document.getElementById('feed-summary-text');

function renderFeedStock() {
    if (!feedContainer) return;
    feedContainer.innerHTML = '';
    let hasLowStock = false;

    feedStock.forEach(item => {
        const percent = Math.min(100, Math.round((item.current / item.max) * 100));
        let barColor = 'high';
        if (percent <= 25) {
            barColor = 'low';   
            hasLowStock = true;
        } else if (percent <= 50) {
            barColor = 'medium';
        }

        const card = document.createElement('div');
        card.className = 'feed-item-card';
        card.innerHTML = `                                                                                                                                                                                         
                <div class="feed-item-header">                                                                                                                                                                         
                    <span class="feed-item-title">${item.icon} ${item.name}</span>                                                                                                                                     
                    <span class="feed-item-amount">${item.current} / ${item.max} ${item.unit}</span>                                                                                                                   
                </div>                                                                                                                                                                                                 
                <div class="feed-progress-bg">                                                                                                                                                                         
                    <div class="feed-progress-bar ${barColor}" style="width: ${percent}%"></div>                                                                                                                       
                </div>                                                                                                                                                                                                 
                <div class="feed-actions">                                                                                                                                                                             
                    <button class="feed-btn use" data-id="${item.id}" data-action="use">- Use 1</button>                                                                                                               
                    <button class="feed-btn restock" data-id="${item.id}" data-action="restock">+ Restock</button>                                                                                                     
                </div>                                                                                                                                                                                                 
            `;
            feedContainer.appendChild(card);
    });

    if (feedSummary) {
        feedSummary.innerText = hasLowStock ? 'Low Stock Alert' : 'Stock Levels Good';
    }
    localStorage.setItem('farmeasy_feed_stock', JSON.stringify(feedStock));
}

if (feedContainer) {
    feedContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.feed-btn');
        if (!btn) return;
        const itemId = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        const item = feedStock.find(i => i.id === itemId);
        if (!item) return;

        if (action === 'use' && item.current > 0) {
            item.current -= 1;
            if (window.spawnFloatingText) window.spawnFloatingText(e, `-1 ${item.unit}`);
        } else if (action === 'restock' && item.current < item.max) {
            item.current += 1;
            if (window.spawnFloatingText) window.spawnFloatingText(e, `+1 ${item.unit}`);
        }
        renderFeedStock();
    });
}

let milkCount = Number(localStorage.getItem('farmeasy_milk_today')) || 0;                                                                                                                                          
let eggCount = Number(localStorage.getItem('farmeasy_eggs_today')) || 0;                                                                                                                                           
let pigsFed = localStorage.getItem('farmeasy_pigs_fed') === 'true';

const milkTally = document.getElementById('milk-tally');                                                                                                                                                           
const eggTally = document.getElementById('egg-tally');                                                                                                                                                             
const pigsStatus = document.getElementById('pigs-status');                                                                                                                                                         
const milkBtn = document.getElementById('collect-milk-btn');                                                                                                                                                       
const eggBtn = document.getElementById('gather-eggs-btn');                                                                                                                                                         
const pigsBtn = document.getElementById('feed-pigs-btn');

function updateLivestockUI() {
    if (milkTally) milkTally.innerText = `${milkCount} Gal`;                                                                                                                                                       
    if (eggTally) eggTally.innerText = `${eggCount} Eggs`;                                                                                                                                                         
    if (pigsStatus) pigsStatus.innerText = pigsFed ? 'Fed & Happy 🐷' : 'Hungry 🌾';                                                                                                                               
    if (pigsBtn) pigsBtn.innerText = pigsFed ? '✅ Fed Today' : '🥕 Feed Slop';                                                                                                                                    
}

if (milkBtn) {
    milkBtn.addEventListener('click', (e) => {
        milkCount += 1;
        localStorage.setItem('farmeasy_milk_today', milkCount);
        updateLivestockUI();
        if (window.spawnFloatingText) window.spawnFloatingText(e, '+1 Gal!');
    });
}

if (eggBtn) {
    eggBtn.addEventListener('click', (e) => {
        eggCount += 6;
        localStorage.setItem('farmeasy_eggs_today', eggCount);
        updateLivestockUI();
        if (window.spawnFloatingText) window.spawnFloatingText(e, '+6 Eggs!');
    });
}

if (pigsBtn) {
    pigsBtn.addEventListener('click', (e) => {
        pigsFed = !pigsFed;
        localStorage.setItem('farmeasy_pigs_fed', pigsFed);
        updateLivestockUI();
        if (window.spawnFloatingText) window.spawnFloatingText(e, pigsFed ? 'Fed 🥕' : 'Hungry 🌾');    
    });
}

const pumpBtn = document.getElementById('test-pump-btn');
const pumpBadge = document.getElementById('pump-status-badge');

if (pumpBtn && pumpBadge) {
    pumpBtn.addEventListener('click', () => {
        pumpBtn.disabled = true;
        pumpBtn.innerText = "Testing Pressure...";
        pumpBadge.innerText = "Pumping...";
        pumpBadge.style.backgroundColor = '#d8ebf9';
        pumpBadge.style.color = '#1f6596';

        setTimeout(() => {
            pumpBtn.disabled = false;
            pumpBtn.innerText = '🔄 Run Pump Test';
            pumpBadge.innerText = 'Online (42 PSI)';
            pumpBadge.style.backgroundColor = '';
            pumpBadge.style.color = '';
        }, 1200);
    }); 
}

function renderAssetsOverview() {
    const machinerySummary = document.getElementById('machinery-summary-text');
    if (machinerySummary) {
        const overdueCount = fleet.filter(m => m.hoursSinceService >= m.serviceInterval).length;
        machinerySummary.innerText = overdueCount === 0
            ? `${fleet.length} active • All healthy`                                                                                                                                                               
            : `${fleet.length} active • ${overdueCount} needs service`;
    }
}

renderFleet();
renderFeedStock();
updateLivestockUI();
updateSiloUI();