const alertBtn = document.querySelector('.alert-card .btn-primary');
if (alertBtn) {
    alertBtn.addEventListener('click', function() {
        const card = this.closest('alert-card');
        if (!card) return;

        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';

        setTimeout(() => {
            card.remove();
        }, 300);
    });
}

const weatherWidget = document.querySelector('.weather_widget');
const weatherTitle = weatherWdiget ? weatherWdiget.querySelector('h3') : null;
const weatherDemp = weatherWdiget ? weatherWidget.querySelector('p') : null;
const weatherDesc = weatherWidget ? weatherWdiget.querySelector('small') : null;

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