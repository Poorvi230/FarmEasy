const navButtons = document.querySelectorAll('.nav-btn');
let views = document.querySelectorAll('main section');

navButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        console.log("clicked a button", e.target.innerText)
        navButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        views.forEach(v => {
            v.classList.add('hidden');
        });
        let targetId = this.getAttribute('data-target');
        let targetView = document.getElementById(targetId);

        targetView.classList.remove('hidden');
    });
});

const alertBtn = document.querySelector('.alert-card .btn-primary');
if(alertBtn) {
    alertBtn.addEventListener('click', function() {
        const card = this.closest('.alert-card');

        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';

        setTimeout(() => {
            card.remove();
        }, 300);
    });
}
//new chore add
const defaultChores = [
    { id: 1, text: 'Feed the chickens', tag: "Morning", completed: false},
    { id: 2, text: "Check east fence", tag: "Urgent", completed: true},
    { id: 3, text: "Water tomato sprouts", tag: "Afternoon", completed: false}
];

let chores = JSON.parse(localStorage.getItem('farmeasy_chores')) || defaultChores;
let activeFilter = 'all';

    const taskBoard = document.getElementById('task-board-container');                                                                                                                                                 
    const modalOverlay = document.getElementById('chore-modal');                                                                                                                                                       
    const choreInput = document.getElementById('new-chore-input');                                                                                                                                                     
    const choreTagSelect = document.getElementById('chore-tag-select');                                                                                                                                                
    const openModalBtn = document.getElementById('open-chore-modal-btn');                                                                                                                                              
    const saveBtn = document.getElementById('save-chore-btn');
    const cancelBtn = document.getElementById('cancel-chore-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
function saveChoresToStorage() {
    localStorage.setItem('farmeasy_chores', JSON.stringify(chores));
}

function renderChores() {
    if (!taskBoard) return;
    taskBoard.innerHTML = '';

    const filtered = chores.filter(chore => {
        if (activeFilter === 'pending') return !chore.completed;
        if (activeFilter === 'completed') return chore.completed;
        if (activeFilter.toLowerCase() === 'urgent') return chore.tag.toLowerCase() === 'urgent';
        return true;
    });

    if (filtered.length === 0) {
        taskBoard.innerHTML = `<p class="empty-board-msg">No chores found here Grab a cold llemonade</p>`;
        return;
    }

    filtered.forEach(chore => {
        const isUrgent = chore.tag === 'Urgent';
        const card = document.createElement('div');                                                                                                                                                                ;
        card.className = 'task-item';
        card.dataset.id = chore.id;
        card.innerHTML = `
            <button class="task-delete-btn" title="Delete chore">✖</button>                                                                                                                                        
            <span class="task-text">${chore.text}</span>                                                                                                                                                           
            <span class="task-tag ${isUrgent ? 'urgent' : ''}">${chore.tag}</span>                                                                                                                                 
            <input type="checkbox" class="task-check" ${chore.completed ? 'checked' : ''}>                                                                                                                         
        `;
        taskBoard.appendChild(card);
    });
}

if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('hidden');
        choreInput.value = '';
        choreInput.focus();
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
    });
}

if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const text = choreInput.value.trim();
        const tag = choreTagSelect ? choreTagSelect.value : 'Morning';
        if (text) {
            chores.push({
                id: Date.now(),
                text: text,
                tag: tag,
                completed: false
            });
            saveChoresToStorage();
            renderChores();
            modalOverlay.classList.add('hidden');
        }
    });
}

if (choreInput) {
    choreInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveBtn.click();
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        activeFilter = this.getAttribute('data-filter');
        renderChores();
    });
});

renderChores();

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
            rustusStatus.className='status healthy';
            rustusStatus.innerText = 'Serviced & Ready';
            rustusServiced.innerText = 'Last Serviced: Today';

            if (rustusBtn) {
                rustusBtn.innerText = 'Serviced';
                rustusBtn.disabled = true;
                rustusBtn.style.opacity = '0.7';
            }
            if (machinerySummary) machinerySummary.innerText = '3 active All Healthy';
        } else {
            rustusStatus.className = 'status warning';
            rustusStatus.innerText = 'Needs Oil';
            rustusServiced.innerText = 'Last Serviced: Jan 04';
            if (rustusBtn) {
                rustusBtn.innerText = 'Service Tractor';
                rustusBtn.disabled = false;
                rustusBtn.style.opacity = '1';
            }
            if (machinerySummary) machinerySummary.innerText = '3 active 1 needs oil';
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
            feedSummary.innerText = hasLowStock ? '⚠️ Low Stock Alert' : 'Stock Levels Good';                                                                                                                      
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

    function updateLiveStockUI() {
        if (milkTally) milkTally.innerText = `${milkCount} Gal`;
        if (eggTally) eggTally.innerText = `${eggCount} Eggs`;                                                                                                                                                     
        if (pigsStatus) pigsStatus.innerText = pigsFed ? 'Fed & Happy 🐷' : 'Hungry 🌾';                                                                                                                                       
        if (pigsBtn) pigsBtn.innerText = pigsFed ? '✅ Fed Today' : '🥕 Feed Slop';                                                                                                                                    
    }
    updateLiveStockUI();

    if(milkBtn) {
        milkBtn.addEventListener('click', () => {
            milkCount += 1;
            localStorage.setItem('farmeasy_milk_today', milkCount);
            updateLiveStockUI();
        });
    }

    if (eggBtn) {
        eggBtn.addEventListener('click', () => {
            eggCount += 6;
            localStorage.setItem('farmeasy_eggs_today', eggCount);
            updateLiveStockUI();
        });
    }

    if (pigsBtn) {
        pigsBtn.addEventListener('click', () => {
            pigsFed = !pigsFed;
            localStorage.setItem('farmeasy_pigs_fed', pigsFed);
            updateLiveStockUI();
        });
    }

    const pumpBtn = document.getElementById('test-pump-btn');
    const pumpBadge = document.getElementById('pump-status-badge');
    if (pumpBtn && pumpBadge) {
        pumpBtn.addEventListener('click', () => {
            pumpBtn.disabled = true;
            pumpBtn.innerText = 'Testing Pressure...';
            pumpBadge.innerText = 'Pumpinng';
            pumpBadge.style.backgroundColor = '#d8ebf9';
            pumpBadge.style.color = '#1f6596';

            setTimeout(() => {
                pumpBtn.disabled = false;
                pumpBtn.innerText = 'Run Pump Test';
                pumpBadge.innerText = 'Online (optimal)';
                pumpBadge.style.backgroundColor = '#eaf5e1';
                pumpBadge.style.color = '#4a7732';
            }, 1200);
        });
    }

    
    //-splash screen--
    const splash = document.getElementById('splash-screen');
    if(splash) {
        setTimeout(() => {
            splash.classList.add('fade-out');
        }, 2300);
        setTimeout(() => {
            splash.remove();
        }, 3100);
    }
    //-lve weather--
    const weatherWidget = document.querySelector('.weather_widget');
    const weatherTitle = weatherWidget.querySelector('h3');
    const weatherTemp = weatherWidget.querySelector('p');
    const weatherDesc = weatherWidget.querySelector('small');

    const weatherCodes = {
        0: "☀️ Clear skies",
        1: "🌤️ Mostly clear" ,
        2: "⛅ Partly cloudy",
        3: "☁️ Overcast",
        45: "🌫️ Foggy" ,
        51: "🌧️ Light drizzle" ,
        61: "🌧️ Raining" ,
        71: "❄️ Snowing",
        95: "⛈️ Thunderstorm"
    };

    function fetchLiveWeather() {
        weatherDesc.innerText = "Checking the skies...";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`);
                    const data = await response.json();

                    const tempF = Math.round(data.current_weather.temperature);
                    const tempC = Math.round((tempF - 32) * 5 / 9);
                    const code = data.current_weather.weathercode;
                    const condition = weatherCodes[code] || "Wild weather";

                    weatherTitle.innerText = "Live Local Weather";
                    weatherTemp.innerText = `${tempF}°F | ${tempC}°C`;
                    weatherDesc.innerText = condition;

                } catch(error) {
                    console.error("API failed:", error);
                    weatherDesc.innerText = "Weather radio is down.";
                }
            }, () => {
                weatherDesc.innerText = "Location access denied.";
            });
        }
    }
    fetchLiveWeather();

    //--pinboard for tasks--

    if (taskBoard) {
        taskBoard.addEventListener('click', (e) => {
            const item = e.target.closest('.task-item');
            if (!item) return;
            const choreId = Number(item.dataset.id);

            if (e.target.classList.contains('task-delete-btn')) {
                chores = chores.filter( c => c.id !== choreId);
                saveChoresToStorage();
                renderChores();
                return;
            }

            if (e.target.classList.contains('task-check')) {
                const chore = chores.find(c => c.id === choreId);

                if (chore) {
                    chore.completed = e.target.checked;
                    saveChoresToStorage();
                    if (activeFilter !== 'all') {
                        renderChores();
                    }
                }
                return;
            }
            document.querySelectorAll('.task-item').forEach(note => {
                if (note !== item) note.classList.remove('expanded-note');
            });
            item.classList.toggle('expanded-note');
        });
    }