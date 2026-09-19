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

    const machineryCard = document.getElementById('card-machinery');
    const overviewGrid = document.getElementById('asset-overview-grid');
    const machineryDetails = document.getElementById('machinery-details');
    const backBtn = document.getElementById('back-to-assets');

    if(machineryCard && overviewGrid && machineryDetails) {
        machineryCard.addEventListener('click', () => {
            overviewGrid.classList.add('hidden');
            machineryDetails.classList.remove('hidden');
        });
        backBtn.addEventListener('click', () => {
            machineryDetails.classList.add('hidden');
            overviewGrid.classList.remove('hidden');
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
    const taskBoard = document.querySelector('.task-list');

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