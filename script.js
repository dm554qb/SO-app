// Skript: Spojenie gpx_csv_processing.js a map_display.js do jedného script.js

document.getElementById('processButton').addEventListener('click', () => {
    const gpxFile = document.getElementById('gpxInput').files[0];
    const csvFile = document.getElementById('sensorCSVInput').files[0];

    if (!gpxFile || !csvFile) {
        document.getElementById('mergeStatus').textContent = "Nahrajte GPX aj CSV súbor!";
        return;
    }

    startBackgroundProcessing(gpxFile, csvFile);
});

// Inicializácia načítania a zlúčenia dát na pozadí
function startBackgroundProcessing(gpxFile, csvFile) {
    loadFilesAndMerge(gpxFile, csvFile);
}

// Funkcia na parsovanie GPX súborov a odpočítanie jednej hodiny
function parseGPX(gpxData) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxData, 'application/xml');
    const points = [];

    const trackpoints = xmlDoc.getElementsByTagName('trkpt');
    for (const trkpt of trackpoints) {
        const lat = parseFloat(trkpt.getAttribute('lat'));
        const lon = parseFloat(trkpt.getAttribute('lon'));
        const ele = trkpt.getElementsByTagName('ele')[0]?.textContent || '';
        let time = trkpt.getElementsByTagName('time')[0]?.textContent || ''; 

        if (time) {
            let date = new Date(time);
            if (time.endsWith('Z')) {
                const isDST = (date) => {
                    const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
                    const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
                    return date.getTimezoneOffset() < Math.max(january, july);
                };
                
                if (isDST(date)) {
                    date.setHours(date.getHours() - 2);
                } else {
                    date.setHours(date.getHours() - 1);
                }
            }
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        points.push({ lat, lon, ele, time });
    }

    return points;
}

// Nahrávanie a parsovanie GPX a CSV súborov na pozadí
function loadFilesAndMerge(gpxFile, csvFile) {
    const readerGpx = new FileReader();
    const readerCsv = new FileReader();

    readerGpx.onload = (e) => {
        const gpxData = e.target.result;
        const points = parseGPX(gpxData);

        convertedCSVData = points.map(point => ({
            Latitude: point.lat,
            Longitude: point.lon,
            Elevation: point.ele,
            Time: point.time
        }));

        if (sensorCSVData.length > 0) {
            mergeAndDisplayData();
        }
    };

    readerCsv.onload = (e) => {
        const csvData = e.target.result;
        Papa.parse(csvData, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                sensorCSVData = results.data.map(record => {
                    let time = record.Timestamp;
                    if (time) {
                        if (time.includes('/')) {
                            const [datePart, timePart] = time.split(' ');
                            const [day, month, year] = datePart.split('/');
                            time = `${year}-${month}-${day} ${timePart}`;
                        } else {
                            console.warn(`Neznámy formát času: ${time}`);
                        }
                    }
                    return {
                        ...record,
                        Time: time
                    };
                });
    
                if (convertedCSVData.length > 0) {
                    mergeAndDisplayData();
                }
            }
        });
    };

    readerGpx.readAsText(gpxFile);
    readerCsv.readAsText(csvFile);
}

// Funkcia na zlúčenie dát a zobrazenie na mape
function mergeAndDisplayData() {
    const mergedData = mergeCSVData(convertedCSVData, sensorCSVData);
    displayDataOnMap(mergedData);

    const csv = Papa.unparse(mergedData, {
        columns: ['Time', 'Latitude', 'Longitude', 'Elevation', 'PM1.0 (µg/m³)', 'PM2.5 (µg/m³)', 'PM4.0 (µg/m³)', 'PM10.0 (µg/m³)', 'Vlhkosť (%)', 'Teplota (°C)']
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'merged_data.csv');

    console.log('Dáta boli úspešne spojené a zobrazené na mape!');
}

// Funkcia na zlúčenie dát a zjednotenie hodnôt PM2.5
function mergeCSVData(convertedData, sensorData) {
    const sensorDataMap = new Map();
    sensorData.forEach(record => {
        if (!record.Time) return;
        const existing = sensorDataMap.get(record.Time);
        if (existing) {
            for (const key in record) {
                if (key.startsWith('PM') || key.includes('Vlhkosť') || key.includes('Teplota')) {
                    existing[key] = (parseFloat(existing[key]) + parseFloat(record[key])) / 2;
                }
            }
        } else {
            sensorDataMap.set(record.Time, record);
        }
    });

    return convertedData.map(record => ({
        ...record,
        ...sensorDataMap.get(record.Time) || { 'PM1.0 (µg/m³)': 'N/A', 'PM2.5': 'N/A', 'PM4.0 (µg/m³)': 'N/A', 'PM10.0 (µg/m³)': 'N/A', 'Vlhkosť (%)': 'N/A', 'Teplota (°C)': 'N/A' }
    }));
}

// Inicializácia mapy pri načítaní stránky
function initializeMap() {
    map = L.map('map').setView([48.669, 19.699], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    adjustLayout();
}

// Funkcia na úpravu výšky mapy a premiestnenie tabulky pod mapu pri menších obrazovkách
function adjustLayout() {
    const mapElement = document.getElementById('map');
    const dataSectionElement = document.querySelector('.data-section');
    const container = document.querySelector('.container');

    if (mapElement && dataSectionElement && container) {
        const targetHeight = 650; // Nastav fixnú výšku na 650px
        mapElement.style.height = `${targetHeight}px`;
        dataSectionElement.style.height = `${targetHeight}px`;
        dataSectionElement.style.fontSize = '14px'; // Nastav veľkosť písma na 14px

        // Zmeniť usporiadanie pri menších obrazovkách
        if (window.innerWidth <= 768) {
            container.style.flexDirection = 'column';
            dataSectionElement.style.marginTop = '20px';
            mapElement.style.width = '100%';
            dataSectionElement.style.width = '100%';
        } else {
            container.style.flexDirection = 'row';
            dataSectionElement.style.marginTop = '0';
            mapElement.style.width = '70%';
            dataSectionElement.style.width = '30%';
        }
    }
}

// Prispôsobenie rozloženia pri zmene veľkosti okna
window.addEventListener('resize', adjustLayout);

// Funkcia na výber farby a popisu podľa hodnoty PM2.5
function getColor(pm) {
    const value = parseFloat(pm);
    if (isNaN(value)) return '#808080';
    if (value < 1) return '#2ECC71';
    if (value < 3) return '#F1C40F';
    if (value < 6) return '#E67E22';
    if (value < 10) return '#E74C3C';
    return '#C0392B';
}

function getSafetyMessage(pm) {
    const value = parseFloat(pm);
    if (isNaN(value)) return 'Neznáma kvalita vzduchu';
    if (value < 1) return 'Veľmi dobrá kvalita vzduchu - Bezpečné';
    if (value < 3) return 'Mierne znečistenie - Vo všeobecnosti bezpečné';
    if (value < 6) return 'Stredné znečistenie - Môže ovplyvniť citlivé skupiny';
    if (value < 10) return 'Vysoké znečistenie - Nebezpečné pre citlivé skupiny';
    return 'Kritické znečistenie - Nebezpečné pre všetkých';
}

// Funkcia na zobrazenie dát na mape s farebnými markermi
function displayDataOnMap(data) {
    if (!map) {
        initializeMap();
    }

    let markers = [];

    data.forEach(record => {
        const lat = record.Latitude;
        const lon = record.Longitude;
        const time = record.Time;
        const pm1 = record['PM1.0 (µg/m³)'];
        const pm25 = record['PM2.5 (µg/m³)'];
        const pm4 = record['PM4.0 (µg/m³)'];
        const pm10 = record['PM10.0 (µg/m³)'];
        const humidity = record['Vlhkosť (%)'];
        const temperature = record['Teplota (°C)'];

        if (!lat || !lon || pm1 === undefined || pm1 === null || isNaN(pm1)) {
            console.error('Chýbajúce alebo neplatné údaje pre bod:', record);
            return;
        }

        const safetyMessage = getSafetyMessage(pm25);
        const color = getColor(pm25);

        let marker;
        if (color === '#E67E22' || color === '#E74C3C' || color === '#C0392B') {
            // Použite trojuholník pre oranžové a červené hodnoty
            const triangleIcon = L.divIcon({
                className: 'triangle-marker',
                html: `<svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,0 0,20 20,20" style="fill:${color};"/></svg>`
            });
            marker = L.marker([parseFloat(lat), parseFloat(lon)], { icon: triangleIcon }).addTo(map);
        } else {
            // Použite kruh pre ostatné hodnoty
            marker = L.circleMarker([parseFloat(lat), parseFloat(lon)], {
                radius: 8,
                color: color,
                fillOpacity: 0.8,
            }).addTo(map);
        }

        const popupContent = `Čas: ${time}<br>
            PM1.0: ${pm1} µg/m³<br>
            PM2.5: ${pm25} µg/m³<br>
            PM4.0: ${pm4} µg/m³<br>
            PM10.0: ${pm10} µg/m³<br>
            Vlhkosť: ${humidity} %<br>
            Teplota: ${temperature} °C<br>
            <strong>${safetyMessage}</strong>`;
        marker.bindPopup(popupContent);

        marker.on('mouseover', function() {
            marker.openPopup();
            updateSidebarData(time, pm1, pm25, pm4, pm10, humidity, temperature);
        });

        marker.on('mouseout', function() {
            marker.closePopup();
        });

        markers.push(marker);
    });

    const bounds = calculateBounds(data);
    if (bounds) {
        map.fitBounds(bounds);
    }

    updateSidebarSummary(data);
    adjustLayout();
}

function updateSidebarData(time, pm1 = 'N/A', pm25 = 'N/A', pm4 = 'N/A', pm10 = 'N/A', humidity = 'N/A', temperature = 'N/A') {
    document.getElementById('currentPoint').innerHTML = `
        <ul>
            <li>Čas: ${time || 'N/A'}</li>
            <li>PM1.0: ${pm1} µg/m³</li>
            <li>PM2.5: ${pm25} µg/m³</li>
            <li>PM4.0: ${pm4} µg/m³</li>
            <li>PM10.0: ${pm10} µg/m³</li>
            <li>Vlhkosť: ${humidity} %</li>
            <li>Teplota: ${temperature} °C</li>
        </ul>`;
}

function updateSidebarSummary(sensorData) {
    const attributes = ['PM1.0 (µg/m³)', 'PM2.5 (µg/m³)', 'PM4.0 (µg/m³)', 'PM10.0 (µg/m³)', 'Humidity (%)', 'Temperature (°C)'];

    // Mapovanie názvov na slovenský výstup
    const attributeLabels = {
        'PM1.0 (µg/m³)': 'PM1.0 (µg/m³)',
        'PM2.5 (µg/m³)': 'PM2.5 (µg/m³)',
        'PM4.0 (µg/m³)': 'PM4.0 (µg/m³)',
        'PM10.0 (µg/m³)': 'PM10.0 (µg/m³)',
        'Humidity (%)': 'Vlhkosť (%)',
        'Temperature (°C)': 'Teplota (°C)'
    };

    const summary = {
        min: {}, max: {}, avg: {}
    };

    attributes.forEach(attr => {
        const values = sensorData.map(d => parseFloat(d[attr])).filter(v => !isNaN(v));
        if (values.length) {
            summary.min[attr] = Math.min(...values).toFixed(2);
            summary.max[attr] = Math.max(...values).toFixed(2);
            summary.avg[attr] = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2);
        } else {
            summary.min[attr] = 'N/A';
            summary.max[attr] = 'N/A';
            summary.avg[attr] = 'N/A';
        }
    });

    // Vykreslenie výstupu s použitím slovenských názvov
    document.getElementById('minPM').innerHTML = summaryDisplay(summary.min, attributeLabels);
    document.getElementById('maxPM').innerHTML = summaryDisplay(summary.max, attributeLabels);
    document.getElementById('avgPM').innerHTML = summaryDisplay(summary.avg, attributeLabels);
}

function summaryDisplay(summary, attributeLabels) {
    return Object.entries(summary)
        .map(([key, value]) => `<li>${attributeLabels[key]}: ${value}</li>`)
        .join('');
}


function calculateBounds(data) {
    const latitudes = [];
    const longitudes = [];

    data.forEach((point) => {
        const lat = point.Latitude;
        const lon = point.Longitude;
        if (lat && lon) {
            latitudes.push(parseFloat(lat));
            longitudes.push(parseFloat(lon));
        }
    });

    if (latitudes.length === 0 || longitudes.length === 0) {
        console.error('Neboli nájdené platné súradnice v dátach.');
        return null;
    }

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);

    return [
        [minLat, minLon],
        [maxLat, maxLon],
    ];
}

// Inicializácia mapy pri načítaní stránky
document.addEventListener('DOMContentLoaded', initializeMap);
