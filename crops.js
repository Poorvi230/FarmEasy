const CROP_TYPES = {
    carrot: { name: 'Carrot', emoji: '🥕', growTime: 15, yield: 4 },
    tomato: { name: 'Tomato', emoji: '🍅', growTime: 30, yield: 3 },                                                                                                                                               
    corn: { name: 'Sweet Corn', emoji: '🌽', growTime: 45, yield: 2 },                                                                                                                                             
    strawberry: { name: 'Strawberry', emoji: '🍓', growTime: 60, yield: 5 }                                                                                                                                        
}

let selectedCropKey = 'carrot';

const defaultPlots = [
            { id: 1, crop: 'carrot', plantedAt: Date.now() - 6000, duration: 15, watered: true },
        { id: 2, crop: 'tomato', plantedAt: Date.now() - 22000, duration: 30, watered: false },                                                                                                                        
        { id: 3, crop: null, plantedAt: null, duration: 0, watered: false },                                                                                                                                           
        { id: 4, crop: null, plantedAt: null, duration: 0, watered: false },                                                                                                                                           
        { id: 5, crop: null, plantedAt: null, duration: 0, watered: false },                                                                                                                                           
        { id: 6, crop: null, plantedAt: null, duration: 0, watered: false }                                                                                                                                            
];

let plots = JSON.parse(localStorage.getItem('farmeasy_plots')) || defaultPlots;
let harvestStorage = JSON.parse(localStorage.getItem('farmeasy_harvest')) || {
    carrot: 8,
    tomato: 3,
    corn: 0,
    strawberry: 0
};

const plotsGrid = document.getElementById('garden-plots-grid');
const harvestSummaryRow = document.getElementById('harvest-summary-row');
const totalProduceText = document.getElementById('total-produce-count');
const seedChips = document.querySelectorAll('.seed-chip');
const waterAllBtn = document.getElementById('water-all-btn');

function saveFarmPlots() {
    localStorage.setItem('farmeasy_plots', JSON.stringify(plots));
    localStorage.setItem('farmeasy_harvest', JSON.stringify(harvestStorage));
}

seedChips.forEach(chip => {
    chip.addEventListener('click', () => {
        seedChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedCropKey = chip.getAttribute('data-crop');
    });
});

function renderHarvestSummary() {
    if (!harvestSummaryRow) return;
    harvestSummaryRow.innerHTML = '';
    let totalItems = 0;

    Object.keys(CROP_TYPES).forEach(key => {
        const count = harvestStorage[key] || 0;
        totalItems += count;
        const pill = document.createElement('div');
        pill.className = 'harvest-item-pill';
        pill.innerText = `${CROP_TYPES[key].emoji} ${CROP_TYPES[key].name}: ${count}`;
        harvestSummaryRow.appendChild(pill);
    });

    if (totalProduceText) {
        totalProduceText.innerText = `${totalItems} items sorted`;
    }
}

function renderPlots() {
    if (!plotsGrid) return;
    plotsGrid.innerHtml = '';
    const now = Date.now();

    plots.forEach(plot => {
        const card = document.createElement('div');
        card.className = `plot-card ${plot.watered ? 'watered-bed' : ''}`;
        card.dataset.id = plot.id;
        if (!plot.crop) {
            card.innerHTML = `                                                                                                                                                                                     
                    <div class="plot-header">
                        <span>Bed #${plot.id}</span>
                        <span class="plot-badge-empty">Empty</span>
                    </div>
                    <div class="plot-body">
                        <span class="plot-emoji">🟫</span>
                        <p class="plot-name">Tilled Soil</p>
                        <small class="plot-timer">Ready for seeds</small>
                    </div>
                    <button class="plot-action-btn plant" data-action="plant">Plant ${CROP_TYPES[selectedCropKey].name}</button>
                `;                                                                                                                                                                                                     
        } else {
            const cropConfig = CROP_TYPES[plot.crop];
            const speedMultiplier = plot.watered ? 1.5 : 1.0;
            const elapsed = ((now - plotPlantedAt) / 1000) * speedMultiplier;
            const progress = Math.min(100, Math.floot((elapsed / plot.duration) * 100));
            const remainingSec = Math.max(0, Math.ceil((plot.duration - elapsed) / speedMultiplier));
            const isReady = progress >= 100;

            let stageEmoji = '🌱';
            if (progress >= 45 && !isReady) stageEmoji = '🌿';
            if (isReady) stageEmoji = cropConfig.emoji;

            let actionButton = '';
            if (isReady) {
                actionButton = `<button class="plot-action-btn harvest" data-action="harvest">🧺 Harvest (+${cropConfig.yield})</button>`;                                                                         
            } else if (!plot.watered) {
                actionButton = `<button class="plot-action-btn water" data-action="water">💧 Water Bed</button>`;                                                                                                  
            } else {
                actionButton = `<button class="plot-action-btn moist" disabled>💧 Moist (+1.5x)</button>`;                                                                                                         
            }

            card.innerHTML = `                                                                                                                                                                                     
                <div class="plot-header">                                                                                                                                                                          
                    <span>Bed #${plot.id}</span>                                                                                                                                                                   
                    <span class="${plot.watered ? 'plot-badge-moist' : 'plot-badge-dry'}">${plot.watered ? '💧 Moist' : 'Dry'}</span>                                                                              
                </div>                                                                                                                                                                                             
                <div class="plot-body">                                                                                                                                                                            
                    <span class="plot-emoji ${isReady ? 'crop-bounce' : ''}">${stageEmoji}</span>                                                                                                                  
                    <p class="plot-name">${cropConfig.name}</p>                                                                                                                                                    
                    <small class="plot-timer">${isReady ? '✨ Ready to harvest!' : `⏳ ${remainingSec}s left`}</small>                                                                                             
                    <div class="plot-progress-bg">                                                                                                                                                                 
                    <div class="plot-progress-fill" style="width: ${progress}%"></div>                                                                                                                         
                    </div>                                                                                                                                                                                         
                </div>                                                                                                                                                                                             
                ${actionButton}                                                                                                                                                                                    
            `;                  
        }
        plotsGrid.appendChild(card);
    });
}

if (plotsGrid) {
    plotsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.plot-action-btn');
        if (!btn) return;
        const card = btn.closest('.plot-card');
        const plotId = Number(card.dataset.id);
        const plot = plots.find(p => p.id === plotId);
        if (!plot) return;

        const action = btn.getAttribute('data-action');

        if (action === 'plant') {
            const cropData = CROP_TYPES[selectedCropKey];
            plot.crop = selectedCropKey;
            plot.plantedAt = Date.now();
            plot.duration = cropData.growTime;
            plot.watered = false;
            saveFarmPlots();
            renderPlots();
        } else if (action === 'water') {
            plot.watered = true;
            saveFarmPlots();
            renderPlots();
        } else if (action === 'harvest') {
            const cropKey = plot.crop;
            const cropData = CROP_TYPES[cropKey];
            harvestStorage[cropKey] = (harvestStorage[cropKey] || 0) + cropData.yield;

            plot.crop = null;
            plot.plantedAt = null;
            plot.duration = 0;
            plot.watered = false;

            saveFarmPlots();
            renderHarvestSummary();
            renderPlots();
        }
    });
}

if (waterAllBtn) {
    waterAllBtn.addEventListener('click', () => {
        let anyWatered = false;
        plots.forEach(plot => {
            if (plot.crop && !plot.watered) {
                plot.watered = true;
                anyWatered = true;
            }
        });
        if (anyWatered) {
            saveFarmPlots();
            renderPlots();
        }
    });
}
setInterval(() => {
    const fieldsView = document.getElementById('fields-view');
    if (fieldsView && !fieldsView.classList.contains('hidden')) {
        renderPlots();
    }
}, 1000);

renderHarvestSummary();
renderPlots();