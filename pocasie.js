const apiKey = 'fe04a97a6d4495c64b721cedb16596c2'; // Váš API kľúč

async function fetchWeatherByCityId(cityId, elementId) {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&lang=sk&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const temperature = data.main.temp; // Získanie teploty
        document.getElementById(elementId).textContent = `${temperature} °C`;
    } catch (error) {
        console.error(`Chyba pri načítaní údajov pre mesto ID (${cityId}):`, error);
        document.getElementById(elementId).textContent = "Chyba načítania";
    }
}

async function fetchAirQuality(lat, lon, elementId) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const pm25 = data.list[0].components.pm2_5; // Získanie PM2.5
        document.getElementById(elementId).textContent = `${pm25.toFixed(1)} µg/m³`;
    } catch (error) {
        console.error(`Chyba pri načítaní údajov o kvalite ovzdušia (${lat}, ${lon}):`, error);
        document.getElementById(elementId).textContent = "Chyba načítania";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Načítanie údajov pre jednotlivé mestá
    fetchWeatherByCityId(865084, 'temperature-kosice'); // Košice
    fetchAirQuality(48.7164, 21.2611, 'pm25-kosice'); // Košice

    fetchWeatherByCityId(865085, 'temperature-presov'); // Prešov
    fetchAirQuality(48.9985, 21.2339, 'pm25-presov'); // Prešov

    fetchWeatherByCityId(723846, 'temperature-batizovce'); // Batizovce
    fetchAirQuality(49.0665, 20.2195, 'pm25-batizovce'); // Batizovce
});