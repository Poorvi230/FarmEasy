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

const weatherCodes = {
            0: { label: "Clear skies", icon: "☀️" },                                                                                                                                                                       
        1: { label: "Mostly clear", icon: "🌤️" },                                                                                                                                                                      
        2: { label: "Partly cloudy", icon: "⛅" },                                                                                                                                                                     
        3: { label: "Overcast", icon: "☁️" },                                                                                                                                                                          
        45: { label: "Foggy", icon: "🌫️" },                                                                                                                                                                            
        48: { label: "Frost fog", icon: "🌫️" },                                                                                                                                                                        
        51: { label: "Light drizzle", icon: "🌦️" },                                                                                                                                                                    
        53: { label: "Moderate drizzle", icon: "🌦️" },                                                                                                                                                                 
        55: { label: "Dense drizzle", icon: "🌧️" },                                                                                                                                                                    
        56: { label: "Freezing drizzle", icon: "🌨️" },                                                                                                                                                                 
        57: { label: "Dense freezing drizzle", icon: "🌨️" },                                                                                                                                                           
        61: { label: "Slight rain", icon: "🌧️" },                                                                                                                                                                      
        63: { label: "Moderate rain", icon: "🌧️" },                                                                                                                                                                    
        65: { label: "Heavy rain", icon: "🌧️" },                                                                                                                                                                       
        66: { label: "Freezing rain", icon: "🌨️" },                                                                                                                                                                    
        67: { label: "Heavy freezing rain", icon: "🌨️" },                                                                                                                                                              
        71: { label: "Slight snow", icon: "❄️" },                                                                                                                                                                      
        73: { label: "Moderate snow", icon: "❄️" },                                                                                                                                                                    
        75: { label: "Heavy snow", icon: "❄️" },                                                                                                                                                                       
        77: { label: "Snow grains", icon: "🌨️" },                                                                                                                                                                      
        80: { label: "Passing rain showers", icon: "🌦️" },                                                                                                                                                             
        81: { label: "Moderate rain showers", icon: "🌧️" },                                                                                                                                                            
        82: { label: "Violent rain showers", icon: "⛈️" },                                                                                                                                                             
        85: { label: "Light snow showers", icon: "🌨️" },                                                                                                                                                               
        86: { label: "Heavy snow showers", icon: "🌨️" },                                                                                                                                                               
        95: { label: "Thunderstorm", icon: "⛈️" },                                                                                                                                                                     
        96: { label: "Thunderstorm with hail", icon: "⛈️" },                                                                                                                                                           
        99: { label: "Severe hail thunderstorm", icon: "⛈️" }                                                                                                                                                          
};

function evaluateSprayWindow(windMph, tempF, weatherCode) {
    const isRain = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode);

    if (isRain) {
        return {
            status: "danger",
            badgeText: "⛔ Spray Prohibited (Rain Active)",
            reason: "Precipitation detected. Wash-off hazard; wait for foliage and soil to dry."
        };
    }

    if (windMph > 14) {
        return {
            status: "danger",
            badgeText: "⛔ High Drift Hazard (>14 mph)",                                                                                                                                                           
            reason: `Wind speed is ${windMph} mph. Severe chemical drift risk onto neighboring crops & waterways.`                                                                                                 
        };
    }

    if (windMph > 9) {
        return {
            status: "caution",
            badgeText: "⚠️ Marginal Spray Window (10–14 mph)",                                                                                                                                                     
            reason: `Wind is ${windMph} mph. Use low-drift air-induction nozzles and lower boom height.`                                                                                                           
        };
    }
    if (tempF > 85) {                                                                                                                                                                                              
        return {                                                                                                                                                                                                   
            status: "caution",                                                                                                                                                                                     
            badgeText: "⚠️ High Volatilization (>85°F)",                                                                                                                                                           
            reason: "High ambient temperature accelerates droplet evaporation before reaching canopy."                                                                                                             
        };                                                                                                                                                                                                         
    }                                                                                                                                                                                                             
    return {                                                                                                                                                                                                       
        status: "optimal",                                                                                                                                                                                         
        badgeText: "✅ Optimal Spray Window (3–9 mph)",                                                                                                                                                            
        reason: `Wind ${windMph} mph, ${tempF}°F. Ideal droplet deposition with minimal drift hazard.`                                                                                                             
    };
}

function evaluateTrafficability(weatherCode) {
    const heavyRain = [63, 65, 67, 81, 82, 95, 96, 99].includes(weatherCode);
    const lightRain = [51, 53, 55, 61, 80].includes(weatherCode);

    if (heavyRain) {
        return {
            level: "risk",
            text: "High Soil Compaction Risk",
            detail: "fields saturated; heavy tractors will cause severe deep rutting & compaction."
        };
    }
    if (lightRain) {
        return {
            level: "caution",
            text: "Moist / Light Rutting Risk",
            detail: "Limit axle loads; inspect headlands before taking heavy equipment into the field."
        };
    }
    return {
        level: "good",
        text: "Dry / Fully passable",
        detail: "Ground firm and dry for tillage, planting, and heavy combine passes."
    };
}

function updateDashboardKPIs() {
    const acresEl = document.getElementById('dash-kpi-acres');
    const livestockEl = document.getElementById('dash-kpi-livestock');
    const fleetEl = document.getElementById('dash-kpi-fleet');

    if (acresEl) {
        try {
            const parcels = JSON.parse(localStorage.getItem('farmeasy_field_parcels')) || [];
            const total = parcels.reduce((sum, p) => sum + (p.acreage || 0), 0);
            acresEl.innerText = total > 0 ? `${total} Ac` : "90 Ac";  
        } catch (e) {
            acresEl.innerText = "90 Ac";
        }
    }

    if (livestockEl) {
        livestockEl.innerText = "50 Head";
    }

    if (fleetEl) {
        const isRustusServiced = localStorage.getItem('farmeasy_rustus_serviced') === 'true';
        fleetEl.innerText = isRustusServiced ? "3 / 3 Ready" : "2 / 3 Ready";                                                                                                                                      
        fleetEl.style.color = isRustusServiced ? "var(--brand-green)" : "var(--brand-orange)";
        const alertCard = document.querySelector('.alert-card');
        if (alertCard) {
            alertCard.style.display = isRustusServiced ? 'none' : 'block';
        }                                                                                                                     
    }
}
window.updateDashboardKPIs = updateDashboardKPIs;

async function loadWeatherData(lat, lon, stationLabel) {
    const stationTitleEl = document.getElementById('weather-station-title');                                                                                                                                       
    const tempEl = document.getElementById('weather-temp-val');                                                                                                                                                    
    const conditionEl = document.getElementById('weather-condition-val');                                                                                                                                          
    const windEl = document.getElementById('weather-wind-val');                                                                                                                                                    
    const humidityEl = document.getElementById('weather-humidity-val');                                                                                                                                            
    const sprayBadgeEl = document.getElementById('spray-window-badge');                                                                                                                                            
    const sprayReasonEl = document.getElementById('spray-window-reason');                                                                                                                                          
    const trafficTextEl = document.getElementById('trafficability-text');                                                                                                                                          
    const trafficDetailEl = document.getElementById('trafficability-detail');       
    
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&temperature_unit=fahrenheit&windspeed_unit=mph`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        const current = data.current_weather || {};
        const tempF = Math.round(current.temperature !== undefined ? current.temperature : (current.temprature !== undefined ? current.temprature : 72));
        const tempC = Math.round((tempF - 32) * 5 / 9);
        const windMph = Math.round(current.windspeed !== undefined ? current.windspeed : 6);
        const code = current.weathercode !== undefined ? current.weathercode : (current.weather_code !== undefined ? current.weather_code : (current.weatherCode || 0));
        const weatherInfo = weatherCodes[code] || { label: "Clear skies", icon: "☀️" };

        let humidity = 55;
        if (data.hourly && data.hourly.relativehumidity_2m && data.hourly.relativehumidity_2m.length > 0) {
            humidity = Math.round(data.hourly.relativehumidity_2m[0]);
        }

        if (stationTitleEl) stationTitleEl.innerText = stationLabel;
        if (tempEl) tempEl.innerText = `${tempF}°F / ${tempC}°C`; 
        if (conditionEl) conditionEl.innerText = `${weatherInfo.icon} ${weatherInfo.label}`;
        if (windEl) windEl.innerText = `${windMph} mph`;   
        if (humidityEl) humidityEl.innerText = `${humidity}%`;

        const sprayResult = evaluateSprayWindow(windMph, tempF, code);
        if (sprayBadgeEl) {
            sprayBadgeEl.className = `spray-badge ${sprayResult.status}`;
            sprayBadgeEl.innerText = sprayResult.badgeText;
        }
        if (sprayReasonEl) {
            sprayReasonEl.innerText = sprayResult.reason;
        }

        const trafficResult = evaluateTrafficability(code);
        if (trafficTextEl) {
            trafficTextEl.innerText = trafficResult.text;
            trafficTextEl.className = `traffic-status ${trafficResult.level}`; 
        }
        if (trafficDetailEl) {
            trafficDetailEl.innerText = trafficResult.detail;
        }
    } catch (err) {
        console.warn("Weather API fallback active: ", err);
        if (stationTitleEl) stationTitleEl.innerText = "🌾 Heartland Farm Station (Offline Cached)";  
        if (tempEl) tempEl.innerText = "72°F / 22°C"; 
        if (conditionEl) conditionEl.innerText = "☀️ Clear skies"; 
        if (windEl) windEl.innerText = "6 mph";
        if (humidityEl) humidityEl.innerText = "52%";
        if (sprayBadgeEl) {
            sprayBadgeEl.className = "spray-badge optimal";
            sprayBadgeEl.innerText = "✅ Optimal Spray Window (3–9 mph)";
        }
        if (sprayReasonEl) {
            sprayReasonEl.innerText = "Wind 6 mph, 72°F. Excellent conditions for field application.";
        }
        if (trafficTextEl) {
            trafficTextEl.innerText = "Dry / Fully Passable"; 
            trafficTextEl.className = "traffic-status good";
        }
        if (trafficDetailEl) {
            trafficDetailEl.innerText = "Ground firm and dry for all tillage and equipment passes.";
        }
    }
}

function initAgriculturalWeather() {
    updateDashboardKPIs();

    const fallbackLat = 41.8781;
    const fallbackLon = -93.0977;

    if (navigator.geolocation && window.location.protocol.startsWith('http')) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                loadWeatherData(position.coords.latitude, position.coords.longitude, "📍 Local Field Station");
            },
            () => {
                loadWeatherData(fallbackLat, fallbackLon, "🌾 Heartland Farm Station");
            },
            { timeout: 5000 }
        );
    } else {
        loadWeatherData(fallbackLat, fallbackLon, "🌾 Heartland Farm Station");
    }
}

initAgriculturalWeather();