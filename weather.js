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

// 2. Live Weather API (Open-Meteo + Geolocation with Agricultural Fallback)
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
    48: "🌫️ Depositing rime fog",
    51: "🌦️ Light drizzle",
    53: "🌦️ Moderate drizzle",
    55: "🌧️ Dense drizzle",
    56: "🌨️ Freezing drizzle",
    57: "🌨️ Heavy freezing drizzle",
    61: "🌧️ Light rain",
    63: "🌧️ Moderate rain",
    65: "🌧️ Heavy rain",
    66: "🌨️ Freezing rain",
    67: "🌨️ Heavy freezing rain",
    71: "❄️ Light snow",
    73: "❄️ Moderate snow",
    75: "❄️ Heavy snow",
    77: "🌨️ Snow grains",
    80: "🌦️ Light showers",
    81: "🌧️ Moderate showers",
    82: "⛈️ Violent rain showers",
    85: "🌨️ Light snow showers",
    86: "🌨️ Heavy snow showers",
    95: "⛈️ Thunderstorm",
    96: "⛈️ Thunderstorm with hail",
    99: "⛈️ Severe thunderstorm with hail"
};

async function loadWeatherData(lat, lon, stationLabel) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`
        );

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();

        const tempF = Math.round(data.current_weather.temperature);
        const tempC = Math.round((tempF - 32) * 5 / 9);
        const code = data.current_weather.weathercode;
        const windMph = Math.round(data.current_weather.windspeed);
        const condition = weatherCodes[code] || "Fair weather";

        if (weatherTitle) weatherTitle.innerText = stationLabel;
        if (weatherTemp) weatherTemp.innerText = `${tempF}°F | ${tempC}°C`;
        if (weatherDesc) weatherDesc.innerText = `${condition} • Wind ${windMph} mph`;
    } catch (error) {
        console.warn("Weather API fallback active: ", error);
        if (weatherTitle) weatherTitle.innerText = "🌾 Farm Weather Station";
        if (weatherTemp) weatherTemp.innerText = "72°F | 22°C";
        if (weatherDesc) weatherDesc.innerText = "☀️ Clear skies • Wind 6 mph";
    }
}

function fetchLiveWeather() {
    if (!weatherWidget || !weatherDesc) return;
    weatherDesc.innerText = "Connecting to weather satellite...";

    // Default Heartland agricultural coordinates (Iowa farm belt)
    const fallbackLat = 41.8781;
    const fallbackLon = -93.0977;

    if (navigator.geolocation && window.location.protocol.startsWith('http')) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                loadWeatherData(position.coords.latitude, position.coords.longitude, "📍 Local Field Weather");
            },
            () => {
                // Location access denied or unavailable -> use farm station fallback
                loadWeatherData(fallbackLat, fallbackLon, "🌾 Heartland Farm Station");
            },
            { timeout: 5000 }
        );
    } else {
        // file:// protocol or geolocation unsupported -> immediate farm station fetch
        loadWeatherData(fallbackLat, fallbackLon, "🌾 Heartland Farm Station");
    }
}

fetchLiveWeather();