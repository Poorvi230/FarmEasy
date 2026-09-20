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
    });
});

const rustusBtn = document.getElementById('service-rustus-btn');
const rustusStatus = document.getElementById('rustus-status');
const rustusServiced = document.getElementById('rustus-serviced');
const machinerySummary = document.getElementById('machinery-summary-text');
let isRustusServiced = localStorage.getItem('farmeasy_rustus_serviced') === 'true';

function updateRustusUI() {
    if (!rustusStatus || !rustusServiced) return;
    if (isRustusServiced) {
        rustusStatus.className = 'status healthy';
        rustusStatus.innerText = 'Serviced & Ready';
        rustusServiced.innerText = 'Last Serviced: Today';
        if (rustusBtn) {
            rustusBtn.innerText = 'Serviced';
            rustusBtn.disabled = true;
            rustusBtn.style.opacity = '0.7';
        }
        if (machinerySummary) machinerySummary.innerText = '3 active All healthy';
    } else {
        rustusStatus.className = 'status warning';
        rustusStatus.innerText = 'Needs Oil'
        rustusServiced.innerText = 'Last Serviced: Jan 04';
        if (rustusBtn) {
            rustusBtn.innerText = 'Service Tractor';
            rustusBtn.disabled = false;
            rustusBtn.style.opacity = '1';
        }
        if (machinerySummary) machinerySummary.innerText = '3 active • 1 needs oil';
    }
}
updateRustusUI();

if (rustusBtn) {
    rustusBtn.addEventListener('click', () => {
        isRustusServiced = true;
        localStorage.setItem('farmeasy_rustus_serviced', 'true');
        updateRustusUI();

        const alertCard = document.querySelector('.alert-card');
        if (alertCard) alertCard.remove();
    });
}

const defaultFeedStock = [
            { id: 'wheat', name: 'Wheat Seeds', icon: '🌾', current: 14, max: 30, unit: 'bags' },                                                                                                                          
        { id: 'corn', name: 'Corn Feed', icon: '🌽', current: 4, max: 25, unit: 'sacks' },                                                                                                                             
        { id: 'fertilizer', name: 'Organic Fertilizer', icon: '🧪', current: 18, max: 20, unit: 'kg' },                                                                                                                
        { id: 'chicken', name: 'Layer Feed', icon: '🪱', current: 8, max: 15, unit: 'bags' }                                                                                                                           
]

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
            barColor = 'low'
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
renderFeedStock();

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
        } else if (action === 'restock' && item.current < item.max) {
            item.current += 1;
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
updateLivestockUI();

if (milkBtn) {
    milkBtn.addEventListener('click', () => {
        milkCount += 1;
        localStorage.setItem('farmeasy_milk_today', milkCount);
        updateLivestockUI();
    });
}

if (eggBtn) {
    eggBtn.addEventListener('click', () => {
        eggCount += 6;
        localStorage.setItem('farmeasy_eggs_today', eggCount);
        updateLivestockUI();
    });
}

if (pigsBtn) {
    pigsBtn.addEventListener('click', () => {
        pigsFed = !pigsFed;
        localStorage.setItem('farmeasy_pigs_fed', pigsFed);
        updateLivestockUI();
    });
}

const pumpBtn = document.getElementById('test-pump-btn');
const pumpBadge = document.getElementById('pump-status-badge');
if (pumpBtn && pumpBadge) {
    pumpBtn.addEventListener('click', () => {
        pumpBtn.disabled = true;
        pumpBtn.innerText = 'Testing Pressure...';
        pumpBadge.innerText = 'Pumping...'
        pumpBadge.style.backgroundColor = '#d8ebf9';
        pumpBadge.style.color = '#1f6596';

        setTimeout(() => {
            pumpBtn.disabled = false;
            pumpBtn.innerText = 'Run Pump Test';
            pumpBadge.innerText = 'Online';
            pumpBadge.style.backgroundColor = '#eaf5e1';
            pumpBadge.style.color = '#4a7732';
        }, 1200);
    });
}