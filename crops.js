const PHENOLOGICAL_STAGES = [
    { name: "Seeding / Emergence", percent: 15 },
    { name: "Vegetative Growth", percent: 40 },
    { name: "Flowering / Tasseling", percent: 70 },
    { name: "Ripening & Maturation", percent: 90 },
    { name: "Harvest Ready", percent: 100 }
];

const defaultParcels = [
    {
        id: "north-40",
        name: "North 40 Field",
        acreage: 40,
        category: "Grains",
        crop: "Hard Red Winter Wheat",
        variety: "Overland HRW",
        plantedDate: "March 15",
        targetHarvest: "July 20",
        stageIndex: 1,
        soilMoisture: 68,
        expectedYield: "65 bu/ac (2,600 bu total)",
        logs: [
            { date: "Sep 10", type: "Fertilizer", note: "Applied 120 lbs/ac 46-0-0 Urea" },
            { date: "Sep 16", type: "Irrigation", note: "Center pivot run: 1.0 inch water" }
        ]
    },
    {
        id: "riverbed-25",
        name: "Riverbed Paddock",
        acreage: 25,
        category: "Grains",
        crop: "Yellow Dent Corn",
        variety: "Pioneer P1197",
        plantedDate: "April 20",
        targetHarvest: "October 15",
        stageIndex: 2,
        soilMoisture: 54,
        expectedYield: "185 bu/ac (4,625 bu total)",
        logs: [
            { date: "Sep 05", type: "Scouting", note: "Stand emergence 98%, low weed pressure" }
        ]
    },
    {
        id: "south-meadow-15",
        name: "South Meadow",
        acreage: 15,
        category: "Forage",
        crop: "Alfalfa Hay",
        variety: "AmeriStand 407TQ",
        plantedDate: "May 01",
        targetHarvest: "Sep 28",
        stageIndex: 4,
        soilMoisture: 72,
        expectedYield: "2.5 tons/ac (37.5 tons total)",
        logs: [
            { date: "Aug 22", type: "Harvest", note: "1st cut baled: 35 tons high-protein round bales" }
        ]
    },
    {
        id: "east-orchard-10",
        name: "East Orchard",                                                                                                                                                                                      
        acreage: 10,                                                                                                                                                                                               
        category: "Orchard",                                                                                                                                                                                       
        crop: "Honeycrisp Apples",                                                                                                                                                                                 
        variety: "Malus Domestica",                                                                                                                                                                                
        plantedDate: "Perennial (Yr 6)",                                                                                                                                                                           
        targetHarvest: "October 05",                                                                                                                                                                               
        stageIndex: 3,                                                                                                                                                                    
        soilMoisture: 61,                                                                                                                                                                                          
        expectedYield: "750 bu/ac (7,500 bu total)",                                                                                                                                                               
        logs: [                                                                                                                                                                                                    
        { date: "Sep 12", type: "Scouting", note: "Fruit sizing optimal, sugar brix testing 13.5°" }                                                                                                           
        ]                                                                                                                                                                                                          
    }
];

let fieldParcels = JSON.parse(localStorage.getItem('farmeasy_field_parcels')) || defaultParcels;
let parcelFilter = 'all';
let activeParcelForLogging = null;

    const parcelsContainer = document.getElementById('field-parcels-container');                                                                                                                                       
    const totalAcresEl = document.getElementById('kpi-total-acres');                                                                                                                                                   
    const activeVarietiesEl = document.getElementById('kpi-active-varieties');                                                                                                                                         
    const avgMoistureEl = document.getElementById('kpi-avg-moisture');                                                                                                                                                 
    const nextHarvestEl = document.getElementById('kpi-next-harvest');                                                                                                                                                 
    const parcelFilterButtons = document.querySelectorAll('.parcel-filter-btn');    
    
    const activityModal = document.getElementById('field-activity-modal');                                                                                                                                             
    const modalParcelTitle = document.getElementById('modal-parcel-name');                                                                                                                                             
    const activityTypeSelect = document.getElementById('activity-type-select');                                                                                                                                        
    const activityNoteInput = document.getElementById('activity-note-input');                                                                                                                                          
    const saveActivityBtn = document.getElementById('save-activity-btn');                                                                                                                                              
    const cancelActivityBtn = document.getElementById('cancel-activity-btn');   

function saveParcels() {
    localStorage.setItem('farmeasy_field_parcels', JSON.stringify(fieldParcels));
}

function renderParcelsKPIs() {
    if (!totalAcresEl) return;
    const totalAcres = fieldParcels.reduce((sum, p) => sum + p.acreage, 0);
    const avgMoisture = Math.round(fieldParcels.reduce((sum, p) => sum + p.soilMoisture, 0) / (fieldParcels.length || 1));
    const uniqueCrops = new Set(fieldParcels.map(p => p.crop)).size;

    totalAcresEl.innerText = `${totalAcres} Acres`;
    activeVarietiesEl.innerText = `${uniqueCrops} Crops`;
    avgMoistureEl.innerText = `${avgMoisture}%`;

    if (nextHarvestEl) {
        const harvestReady = fieldParcels.find(p => p.stageIndex === PHENOLOGICAL_STAGES.length - 1);
        if (harvestReady) {
            nextHarvestEl.innerText = `${harvestReady.name} (Ready)`;
        } else {
            const nextUp = [...fieldParcels].sort((a, b) => b.stageIndex - a.stageIndex)[0];
            nextHarvestEl.innerText = nextUp ? `${nextUp.name} (${nextUp.targetHarvest})` : "--";
        }
    }
}

function renderParcels() {
    if (!parcelsContainer) return;
    parcelsContainer.innerHTML = '';

    const filtered = fieldParcels.filter(parcel => {
        if (parcelFilter === 'all') return true;
        return parcel.category.toLowerCase() === parcelFilter.toLowerCase();
    });

    if (filtered.length === 0) {
        parcelsContainer.innerHTML =  `<p class="empty-board-msg">No field parcels found in this category.</p>`;
        return;
    }

    filtered.forEach(parcel => {
        const currentStage = PHENOLOGICAL_STAGES[parcel.stageIndex];
        const isHarvestReady = parcel.stageIndex === PHENOLOGICAL_STAGES.length -1;

        let moistureBadgeClass = 'moisture-optimal';
        let moistureLabel = 'Optimal';
        if (parcel.soilMoisture < 50) {
            moistureBadgeClass = 'moisture-dry';
            moistureLabel = 'Dry • Water Needed';
        } else if (parcel.soilMoisture > 80) {
            moistureBadgeClass = 'moisture-wet';
            moistureLabel = 'Saturated';
        }

        const card = document.createElement('div');
        card.className = 'parcel-card';
        card.dataset.id = parcel.id;

        const recentLogsHTML = parcel.logs.slice(-2).map(log => `                                                                                                                                                  
        <div class="parcel-log-pill">                                                                                                                                                                          
            <strong>${log.date} • ${log.type}:</strong> ${log.note}                                                                                                                                            
        </div>                                                                                                                                                                                                 
        `).join(''); 
        
        card.innerHTML = `                                                                                                                                                                                         
                <div class="parcel-card-header">                                                                                                                                                                       
                    <div>                                                                                                                                                                                              
                        <h3 class="parcel-title">${parcel.name}</h3>                                                                                                                                                   
                        <span class="parcel-subtitle">${parcel.acreage} Acres • ${parcel.crop} (${parcel.variety})</span>                                                                                              
                    </div>                                                                                                                                                                                             
                    <span class="parcel-category-tag">${parcel.category}</span>                                                                                                                                        
                </div>                                                                                                                                                                                                 
                                                                                                                                                                                                                       
                <div class="parcel-metrics-grid">                                                                                                                                                                      
                    <div class="metric-cell">                                                                                                                                                                          
                        <small>Sowing Date</small>                                                                                                                                                                     
                        <strong>${parcel.plantedDate}</strong>                                                                                                                                                         
                    </div>                                                                                                                                                                                             
                    <div class="metric-cell">                                                                                                                                                                          
                        <small>Target Harvest</small>                                                                                                                                                                  
                        <strong>${parcel.targetHarvest}</strong>                                                                                                                                                       
                    </div>                                                                                                                                                                                             
                    <div class="metric-cell">                                                                                                                                                                          
                        <small>Soil Moisture</small>                                                                                                                                                                   
                        <strong class="${moistureBadgeClass}">${parcel.soilMoisture}% (${moistureLabel})</strong>                                                                                                      
                    </div>                                                                                                                                                                                             
                    <div class="metric-cell">                                                                                                                                                                          
                        <small>Est. Yield</small>                                                                                                                                                                      
                        <strong>${parcel.expectedYield}</strong>                                                                                                                                                       
                    </div>                                                                                                                                                                                             
                </div>                                                                                                                                                                                                 
                                                                                                                                                                                                                       
                <!-- Phenological Growth Stage -->                                                                                                                                                                     
                <div class="growth-stage-wrapper">                                                                                                                                                                     
                    <div class="stage-labels">                                                                                                                                                                         
                        <span><strong>Stage:</strong> ${currentStage.name}</span>                                                                                                                                      
                        <span>${currentStage.percent}% Maturity</span>                                                                                                                                                 
                    </div>                                                                                                                                                                                             
                    <div class="stage-progress-bg">                                                                                                                                                                    
                        <div class="stage-progress-fill ${isHarvestReady ? 'harvest-ready-fill' : ''}" style="width: ${currentStage.percent}%"></div>                                                                  
                    </div>                                                                                                                                                                                             
                </div>                                                                                                                                                                                                 
                                                                                                                                                                                                                       
                <!-- Recent Activity Log Pills -->                                                                                                                                                                     
                <div class="parcel-activity-history">                                                                                                                                                                  
                    ${recentLogsHTML || '<span style="color:#aaa; font-size:0.8rem; font-style:italic;">No recorded activities yet.</span>'}                                                                           
                </div>                                                                                                                                                                                                 
                                                                                                                                                                                                                       
                <!-- Parcel Actions -->                                                                                                                                                                                
                <div class="parcel-actions">                                                                                                                                                                           
                    <button class="btn-parcel-action btn-irrigate" data-action="irrigate" title="Add 10% soil moisture">💧 Irrigate</button>                                                                           
                    <button class="btn-parcel-action btn-advance" data-action="advance" title="Advance to next phenological stage">⏩ Next Stage</button>                                                              
                    <button class="btn-parcel-action btn-log-activity" data-action="log-activity">📝 Log Activity</button>                                                                                             
                </div>                                                                                                                                                                                                 
            `;
        parcelsContainer.appendChild(card);
    });
    renderParcelsKPIs();
}

if (parcelsContainer) {
    parcelsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-parcel-action');
        if (!btn) return;
        const card = btn.closest('.parcel-card');
        const parcelId = card.dataset.id;
        const parcel = fieldParcels.find(p => p.id === parcelId);
        if (!parcel) return;

        const action = btn.getAttribute('data-action');

        if (action === 'irrigate') {
            parcel.soilMoisture = Math.min(95, parcel.soilMoisture + 10);
            parcel.logs.push({
                date: "Today",
                type: "Irrigation",
                note: "Center pivot application (+10% soil moisture)"
            });
            saveParcels();
            renderParcels();
        } else if (action === 'advance') {
            const wasHarvestReady = parcel.stageIndex === PHENOLOGICAL_STAGES.length - 1;
            if (wasHarvestReady) {
                parcel.stageIndex = 0;
                parcel.logs.push({
                    date: "Today",
                    type: "Harvest",
                    note: `Harvested & Re-seeded: Began new Seeding cycle (${parcel.crop})`
                });
            } else {
                parcel.stageIndex += 1;
                parcel.logs.push({
                    date: "Today",
                    type: "Scouting",
                    note: `Phenology Update: Advanced to ${PHENOLOGICAL_STAGES[parcel.stageIndex].name}`
                });
            }
            saveParcels();
            renderParcels();
        } else if (action === 'log-activity') {
            activeParcelForLogging = parcel;
            if (modalParcelTitle) modalParcelTitle.innerText = parcel.name;
            if (activityNoteInput) {
                activityNoteInput.value = '';
                setTimeout(() => activityNoteInput.focus(), 60);
            }
            if (activityModal) activityModal.classList.remove('hidden');
        }
    });
}

if (saveActivityBtn) {
    saveActivityBtn.addEventListener('click', () => {
        if (!activeParcelForLogging) return;
        const note = activityNoteInput ? activityNoteInput.value.trim() : '';
        const type = activityTypeSelect ? activityTypeSelect.value : 'Scouting';

        if (note) {
            if (!activeParcelForLogging.logs) activeParcelForLogging.logs = [];
            activeParcelForLogging.logs.push({
                date: "Today",
                type: type,
                note: note
            });
            saveParcels();
            renderParcels();
            if (activityModal) activityModal.classList.add('hidden');
        }
    });
}

if (activityNoteInput) {
    activityNoteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (saveActivityBtn) saveActivityBtn.click();
        }
    });
}

if (cancelActivityBtn) {
    cancelActivityBtn.addEventListener('click', () => {
        if (activityModal) activityModal.classList.add('hidden');
    });
}

if (activityModal) {
    activityModal.addEventListener('click', (e) => {
        if (e.target === activityModal) activityModal.classList.add('hidden');
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (activityModal && !activityModal.classList.contains('hidden')) {
            activityModal.classList.add('hidden');
        }
    }
});

parcelFilterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        parcelFilterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        parcelFilter = this.getAttribute('data-filter');
        renderParcels();
    });
});

renderParcels();