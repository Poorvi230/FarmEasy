// 1. Dismissible Alert Card
const alertBtn = document.querySelector('.alert-card .btn-primary');
if (alertBtn) {
    alertBtn.addEventListener('click', function() {
        const card = this.closest('.alert-card');
        if (!card) return;

        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';

        setTimeout(() => {
            card.remove();
        }, 300);
    });
}

// 2. Live Weather API (Open-Meteo + Geolocation)
const weatherWidget = document.querySelector('.weather_widget');
const weatherTitle = weatherWidget ? weatherWidget.querySelector('h3') : null;
const weatherTemp = weatherWidget ? weatherWidget.querySelector('p') : null;
const weatherDesc = weatherWidget ? weatherWidget.querySelector('small') : null;

const weatherCodes = {
    0: "☀️ Clear skies",
    1: "🌤️ Mostly clear",                                                                                                                                                                                          
    2: "⛅ Partly cloudy",                                                                                                                                                                                         
    3: "☁️ Overcast",                                                                                                                                                                                              
    45: "🌫️ Foggy",                                                                                                                                                                                                
    51: "🌧️ Light drizzle",                                                                                                                                                                                        
    61: "🌧️ Raining",                                                                                                                                                                                              
    71: "❄️ Snowing",                                                                                                                                                                                              
    95: "⛈️ Thunderstorm"                                                                                                                                                                                          
};

function fetchLiveWeather() {
    if (!weatherWidget || !weatherDesc) return;
    weatherDesc.innerText = "Checking the skies...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`   
                );

                const data = await response.json();

                const tempF = Math.round(data.current_weather.temperature);
                const tempC = Math.round((tempF - 32) * 5 / 9);
                const code = data.current_weather.weathercode;
                const condition = weatherCodes[code] || "Wild weather";

                if (weatherTitle) weatherTitle.innerText = "Live Local Weather";
                if (weatherTemp) weatherTemp.innerText = `${tempF}°F | ${tempC}°C`;
                weatherDesc.innerText = condition;                                                                                                                                
            } catch (error) {
                console.error("Weather API Failed: ", error);
                weatherDesc.innerText = "Weather Radio is down.";
            }
        }, () => {
            weatherDesc.innerText = "Location access denied.";
        });
    } else {
        weatherDesc.innerText = "Geolocation not supported.";
    }
}

fetchLiveWeather();