// --- INITIAL MAP SETUP ---
// Define a bounding box for Saudi Arabia to lock the view
const saudiArabiaBounds = L.latLngBounds([[15, 34], [32, 56]]);

const map = L.map('map', {
    maxBounds: saudiArabiaBounds,
    minZoom: 5
}).setView([24.77, 46.73], 5); // Centered on Riyadh, Saudi Arabia

// --- NEW RELIABLE MAP TILE LAYER (with no labels) ---
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: false,
        marker: false,
        circle: false,
        rectangle: false,
        circlemarker: false,
        polyline: {
            shapeOptions: {
                color: '#123C2C' 
            }
        }
    }
});
map.addControl(drawControl);


// --- FULL HISTORICAL AND GEOGRAPHICAL DATA WITH COORDINATES AND ARABIC TITLES ---
const historicalPaths = [
    { name: "Hejaz Railway", name_ar: "الخط الحديدي الحجازي", path: [[26.6166, 37.9167], [28.4, 36.57]] },
    { name: "Hijra", name_ar: "الهجرة النبوية", path: [[21.4225, 39.8262], [24.4667, 39.6167]] },
    { name: "Incense Route", name_ar: "طريق البخور", path: [[21.4858, 39.1925], [26.6166, 37.9167]] },
    { name: "Darb Zubaydah", name_ar: "درب زبيدة", path: [[29.8, 43.6], [21.4225, 39.8262]] },
    { name: "Najran", name_ar: "نجران", path: [[17.58, 44.22], [21.4225, 39.8262]] },
    { name: "King's Highway (Saudi Arabia)", name_ar: "طريق الملوك", path: [[21.4858, 39.1925], [21.2854, 40.4191]] },
    { name: "Buraidah", name_ar: "بريدة", path: [[26.3263, 43.9749], [27.5255, 41.6963]] },
    { name: "Arar", name_ar: "عرعر", path: [[27.5255, 41.6963], [30.9859, 41.0366]] },
    { name: "Asir Region", name_ar: "منطقة عسير", path: [[18.2167, 42.5000], [19.9833, 42.6167]] },
    { name: "Al-Ahsa", name_ar: "الأحساء", path: [[26.4258, 50.1026], [25.37, 49.58]] },
    { name: "Yanbu", name_ar: "ينبع", path: [[21.4858, 39.1925], [24.0894, 38.0641]] },
    { name: "Tayma", name_ar: "تيماء", path: [[28.4, 36.57], [27.63, 38.54]] },
    { name: "Qassim Region", name_ar: "منطقة القصيم", path: [[24.7136, 46.6753], [26.3263, 43.9749]] },
    { name: "AlUla", name_ar: "العلا", path: [[26.6166, 37.9167], [26.6166, 37.9167]] },
    { name: "Hegra (Madain Saleh)", name_ar: "مدائن صالح", path: [[26.7865, 37.9547], [26.7865, 37.9547]] },
    { name: "Diriyah", name_ar: "الدرعية", path: [[24.7247, 46.5779], [24.7247, 46.5779]] },
    { name: "Masmak Fort", name_ar: "قصر المصمك", path: [[24.6366, 46.7132], [24.6366, 46.7132]] },
    { name: "Jeddah Historic District", name_ar: "جدة التاريخية", path: [[21.4858, 39.1925], [21.4858, 39.1925]] },
    { name: "Al-Ahsa Oasis", name_ar: "واحة الأحساء", path: [[25.38, 49.58], [25.38, 49.58]] },
    { name: "Qaryat al-Faw", name_ar: "قرية الفاو", path: [[20.505, 45.155], [20.505, 45.155]] },
    { name: "Dumat al-Jandal", name_ar: "دومة الجندل", path: [[29.805, 39.888], [29.805, 39.888]] },
    { name: "Al-Ukhdud Archaeological Area", name_ar: "الأخدود", path: [[17.46, 44.25], [17.46, 44.25]] },
    { name: "Jubbah", name_ar: "جبة", path: [[28.02, 40.91], [28.02, 40.91]] },
    { name: "Tarout Island", name_ar: "تاروت", path: [[26.56, 50.06], [26.56, 50.06]] },
    { name: "Khaybar", name_ar: "خيبر", path: [[25.70, 39.20], [25.70, 39.20]] }
];

let discoveredPathNames = new Set();
const totalPathsCount = historicalPaths.length;
document.getElementById('total-paths-count').textContent = totalPathsCount;

// --- NEW POPUP TOGGLE LOGIC ---
let popupsEnabled = true;

const popupToggleButton = document.querySelector('.leaflet-toggle-popups');

popupToggleButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    popupsEnabled = !popupsEnabled;
    hidePopups(); // Immediately hide popups when the state changes
    console.log(`النوافذ المنبثقة ${popupsEnabled ? 'مفعلة' : 'معطلة'} الآن`);
});


// --- FUNCTION TO GET PLACE NAME FROM COORDINATES (REVERSE GEOCODING) ---
async function getPlaceName(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=ar`);
        const data = await response.json();
        return data.display_name.split(',')[0] || "موقع غير معروف";
    } catch (error) {
        console.error("Nominatim API error:", error);
        return "موقع غير معروف";
    }
}

// --- FUNCTION TO FETCH WIKIPEDIA DATA BY TOPIC ---
async function fetchWikipediaData(topic) {
    try {
        const response = await fetch(`https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
        
        if (!response.ok) {
            return { title: null, extract: null };
        }

        const data = await response.json();
        
        if (data.title && data.extract) {
            return { title: data.title, extract: data.extract };
        } else {
            return { title: null, extract: null };
        }

    } catch (error) {
        console.error("Failed to fetch data:", error);
        return { title: null, extract: null };
    }
}


// --- FUNCTION TO DISPLAY THE POPUPS (MODIFIED) ---
function displayPopup(title, story) {
    if (!popupsEnabled) return;
    const popupContainer = document.getElementById('popup-container');
    const popupTitle = document.getElementById('popup-title');
    const popupStory = document.getElementById('popup-story');
    
    popupTitle.textContent = title;
    popupStory.textContent = story;
    popupContainer.style.display = 'block';
}

// Functions to display city popups (MODIFIED)
function displayCityPopup(containerId, title, story) {
    if (!popupsEnabled) return;
    const container = document.getElementById(containerId);
    const popupTitle = container.querySelector('h3');
    const popupStory = container.querySelector('p');
    
    popupTitle.textContent = title;
    popupStory.textContent = story;
    container.style.display = 'block';
}

function hidePopups() {
    document.getElementById('popup-container').style.display = 'none';
    document.getElementById('start-city-popup-container').style.display = 'none';
    document.getElementById('end-city-popup-container').style.display = 'none';
}

function updateCounter() {
    const countElement = document.getElementById('paths-discovered-count');
    countElement.textContent = discoveredPathNames.size;
}


// --- THE CORE LOGIC: LISTENING FOR A DRAWN PATH ---
map.on(L.Draw.Event.CREATED, async function (event) {
    const layer = event.layer;
    const drawnCoordinates = layer.getLatLngs();
    
    if (drawnCoordinates.length >= 2) {
        const startPoint = drawnCoordinates[0];
        const endPoint = drawnCoordinates[drawnCoordinates.length - 1];
        
        hidePopups(); // Hide all popups at the start of a new draw
        
        if (popupsEnabled) {
             displayPopup("جارٍ البحث...", "نبحث عن معلومات حول رحلتك...");
        }
        
        // --- Try to find a hard-coded match first ---
        let matchFound = false;
        for (const historicalPath of historicalPaths) {
            const historicalStart = L.latLng(historicalPath.path[0][0], historicalPath.path[0][1]);
            const historicalEnd = L.latLng(historicalPath.path[1][0], historicalPath.path[1][1]);
            const distanceTolerance = 100000;
            
            if (startPoint.distanceTo(historicalStart) < distanceTolerance && endPoint.distanceTo(historicalEnd) < distanceTolerance) {
                const result = await fetchWikipediaData(historicalPath.name_ar);
                
                if (result.title) {
                    if (popupsEnabled) {
                        const discoveryPopup = document.getElementById('discovery-popup');
                        discoveryPopup.textContent = `لقد اكتشفت مسارًا: ${result.title}!`;
                        discoveryPopup.style.display = 'block';
                        setTimeout(() => {
                            discoveryPopup.style.display = 'none';
                        }, 2500);
                    }

                    if (!discoveredPathNames.has(result.title)) {
                        discoveredPathNames.add(result.title);
                        updateCounter();
                    }
                    displayPopup(result.title, result.extract);
                    matchFound = true;
                }
                break;
            }
        }
        
        // --- If no hard-coded match, display a generic message ---
        if (!matchFound) {
              const startName = await getPlaceName(startPoint.lat, startPoint.lng);
              const endName = await getPlaceName(endPoint.lat, endPoint.lng);
              displayPopup(`لم يتم العثور على مسار`, `يربط هذا المسار بين ${startName} و ${endName}، ولكن لم يتم العثور على طريق تاريخي محدد.`);
        }
        
        // --- Always display city info in the new popups ---
        const startName = await getPlaceName(startPoint.lat, startPoint.lng);
        const startResult = await fetchWikipediaData(startName);
        if (startResult.title) {
            displayCityPopup('start-city-popup-container', startResult.title, startResult.extract);
        } else {
            displayCityPopup('start-city-popup-container', startName, `لم يتم العثور على معلومات ويكيبيديا لهذا الموقع.`);
        }

        const endName = await getPlaceName(endPoint.lat, endPoint.lng);
        const endResult = await fetchWikipediaData(endName);
        if (endResult.title) {
            displayCityPopup('end-city-popup-container', endResult.title, endResult.extract);
        } else {
            displayCityPopup('end-city-popup-container', endName, `لم يتم العثور على معلومات ويكيبيديا لهذا الموقع.`);
        }
    }
    
    layer.addTo(drawnItems);
});


// --- HANDLE CLICKS ON THE DRAWN LINES ---
let activeLine = null;

drawnItems.on('click', async function (event) {
    const clickedLayer = event.layer;
    
    if (clickedLayer.getLatLngs().length >= 2) {
        const coords = clickedLayer.getLatLngs();
        const startPoint = coords[0];
        const endPoint = coords[coords.length - 1];
        
        if (activeLine === clickedLayer) {
            hidePopups();
            activeLine = null;
        } else {
            hidePopups();
            if (popupsEnabled) {
                displayPopup("جارٍ البحث...", "نبحث عن معلومات حول هذه الرحلة...");
            }
            
            let matchFound = false;
            for (const historicalPath of historicalPaths) {
                const historicalStart = L.latLng(historicalPath.path[0][0], historicalPath.path[0][1]);
                const historicalEnd = L.latLng(historicalPath.path[1][0], historicalPath.path[1][1]);
                const distanceTolerance = 100000;
                
                if (startPoint.distanceTo(historicalStart) < distanceTolerance && endPoint.distanceTo(historicalEnd) < distanceTolerance) {
                    const result = await fetchWikipediaData(historicalPath.name_ar);
                    if (result.title) {
                        displayPopup(result.title, result.extract);
                    }
                    matchFound = true;
                    break;
                }
            }
            
            if (!matchFound) {
                const startName = await getPlaceName(startPoint.lat, startPoint.lng);
                const endName = await getPlaceName(endPoint.lat, endPoint.lng);
                displayPopup(`لم يتم العثور على مسار`, `يربط هذا المسار بين ${startName} و ${endName}، ولكن لم يتم العثور على طريق تاريخي محدد.`);
            }

            const startName = await getPlaceName(startPoint.lat, startPoint.lng);
            const startResult = await fetchWikipediaData(startName);
            if (startResult.title) {
                displayCityPopup('start-city-popup-container', startResult.title, startResult.extract);
            } else {
                displayCityPopup('start-city-popup-container', startName, `لم يتم العثور على معلومات ويكيبيديا لهذا الموقع.`);
            }

            const endName = await getPlaceName(endPoint.lat, endPoint.lng);
            const endResult = await fetchWikipediaData(endName);
            if (endResult.title) {
                displayCityPopup('end-city-popup-container', endResult.title, endResult.extract);
            } else {
                displayCityPopup('end-city-popup-container', endName, `لم يتم العثور على معلومات ويكيبيديا لهذا الموقع.`);
            }

            activeLine = clickedLayer;
        }
    } else {
        hidePopups();
        activeLine = null;
    }
});