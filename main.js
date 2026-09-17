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
const addChoreBtn = document.querySelector('#tasks-view .btn-primary');
const taskList = document.querySelector('.task-list');

const modalOverlay = document.getElementById('chore-modal');
const choreInput = document.getElementById('new-chore-input');
const saveBtn = document.getElementById('save-chore-btn');
const cancelBtn = document.getElementById('cancel-chore-btn');

if(addChoreBtn) {
    addChoreBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('hidden');
        choreInput.value = '';
        choreInput.focus();
    });
}
if(cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });
}
if(saveBtn && taskList) {
      saveBtn.addEventListener('click', () => {
        let newChore = choreInput.value;

        if(newChore.trim() !== "") {
          const newTaskHTML = `
            <div class="task-item" style="animation: popIn 0.3s ease-out;">
              <span class="task-text">${newChore}</span>
              <span class="task-tag">New 🌱</span>
              <input type="checkbox" class="task-check">
            </div>
          `;

          taskList.insertAdjacentHTML('beforeend', newTaskHTML);
          modalOverlay.classList.add('hidden');
        }
      });
    }
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

    if(taskBoard) {
        taskBoard.addEventListener('click', (e) => {
            const item = e.target.closest('.task-item');
            if(!item) return;

            if(e.targert.tagName.toLowerCase() == 'input') return;

            document.querySelectorAll('.task-item').forEach(note => {
                if(note !== item) note.classList.remove('expanded-note');
            });
            item.classList.toggle('expanded-note');
        });
    }