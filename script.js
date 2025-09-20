document.addEventListener('DOMContentLoaded', () => {

    const saudiArabiaBounds = L.latLngBounds([[15, 34], [32, 56]]);
    const map = L.map('map', {
        maxBounds: saudiArabiaBounds,
        minZoom: 5,
        zoomControl: false
    }).setView([24.77, 46.73], 5);

    const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });

    const lightTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });

    if (document.body.classList.contains('dark-mode')) {
        darkTileLayer.addTo(map);
    } else {
        lightTileLayer.addTo(map);
    }

    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    const historicalSites = [
        // Historical/Archaeological Sites
        { name_ar: "مدائن صالح", lat: 26.7865, lng: 37.9547, type: "archaeological" },
        { name_ar: "واحة الأحساء", lat: 25.38, lng: 49.58, type: "archaeological" },
        { name_ar: "قرية الفاو", lat: 20.505, lng: 45.155, type: "archaeological" },
        { name_ar: "الأخدود", lat: 17.46, lng: 44.25, type: "archaeological" },
        { name_ar: "جبة", lat: 28.02, lng: 40.91, type: "archaeological" },
        { name_ar: "خيبر", lat: 25.70, lng: 39.20, type: "historical_site" },
        { name_ar: "الفريان (قصر)", lat: 26.47, lng: 49.99, type: "historical_site" },
        { name_ar: "قصر المصمك", lat: 24.6366, lng: 46.7132, type: "fort" },
        { name_ar: "العقير (ميناء)", lat: 25.6888, lng: 50.2197, type: "historical_site" },
        { name_ar: "قصر إبراهيم", lat: 25.37, lng: 49.58, type: "fort" },
        { name_ar: "قصر شمعون", lat: 29.85, lng: 39.88, type: "fort" },
        { name_ar: "جبل القارة", lat: 25.40, lng: 49.69, type: "historical_site" },
        { name_ar: "جبل أبو مخروق", lat: 24.63, lng: 46.73, type: "historical_site" },
        { name_ar: "محطة سكة حديد الهفوف", lat: 25.38, lng: 49.58, type: "historical_site" },
        
        // Cities (More added for comprehensive coverage)
        { name_ar: "الرياض", lat: 24.7136, lng: 46.6753, type: "city" },
        { name_ar: "جدة", lat: 21.4858, lng: 39.1925, type: "city" },
        { name_ar: "مكة المكرمة", lat: 21.3891, lng: 39.8579, type: "city" },
        { name_ar: "المدينة المنورة", lat: 24.5247, lng: 39.5692, type: "city" },
        { name_ar: "الدمام", lat: 26.43, lng: 50.10, type: "city" },
        { name_ar: "الظهران", lat: 26.27, lng: 50.15, type: "city" },
        { name_ar: "الخبر", lat: 26.22, lng: 50.20, type: "city" },
        { name_ar: "الجبيل", lat: 27.00, lng: 49.65, type: "city" },
        { name_ar: "حائل", lat: 27.52, lng: 41.69, type: "city" },
        { name_ar: "تبوك", lat: 28.39, lng: 36.57, type: "city" },
        { name_ar: "بريدة", lat: 26.3263, lng: 43.9749, type: "city" },
        { name_ar: "خميس مشيط", lat: 18.30, lng: 42.73, type: "city" },
        { name_ar: "أبها", lat: 18.22, lng: 42.50, type: "city" },
        { name_ar: "جازان", lat: 16.88, lng: 42.57, type: "city" },
        { name_ar: "نجران", lat: 17.58, lng: 44.22, type: "city" },
        { name_ar: "دومة الجندل", lat: 29.805, lng: 39.888, type: "city" },
        { name_ar: "تيماء", lat: 27.63, lng: 38.54, type: "city" },
        { name_ar: "العلا", lat: 26.6166, lng: 37.9167, type: "city" },
        { name_ar: "ينبع", lat: 24.0894, lng: 38.0641, type: "city" },
        { name_ar: "عرعر", lat: 30.9859, lng: 41.0366, type: "city" },
        { name_ar: "الهفوف", lat: 25.38, lng: 49.58, type: "city" },
        
        // Routes & Regions
        { name_ar: "الدرعية", lat: 24.7247, lng: 46.5779, type: "historical_city" },
        { name_ar: "جدة التاريخية", lat: 21.4858, lng: 39.1925, type: "historical_city" },
        { name_ar: "الخط الحديدي الحجازي", lat: 26.6166, lng: 37.9167, type: "route" },
        { name_ar: "الهجرة النبوية", lat: 21.4225, lng: 39.8262, type: "route" },
        { name_ar: "طريق البخور", lat: 21.4858, lng: 39.1925, type: "route" },
        { name_ar: "درب زبيدة", lat: 29.8, lng: 43.6, type: "route" },
        { name_ar: "منطقة عسير", lat: 18.2167, lng: 42.5000, type: "region" },
        { name_ar: "طريق الملوك", lat: 21.4858, lng: 39.1925, type: "route" },
        { name_ar: "تاروت", lat: 26.56, lng: 50.06, type: "island" }
    ];
    
    let discoveredPathNames = new Set();
    const totalPathsCount = historicalSites.length;
    document.getElementById('total-paths-count').textContent = totalPathsCount;

    const infoPanel = document.getElementById('info-panel');
    const sidebarIntro = document.querySelector('.sidebar-intro');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const legendContainer = document.getElementById('legend');
    
    // Create an object to hold the different marker layer groups
    const markerLayerGroups = {};

    function toggleInfoPanel(showPanel) {
        if (showPanel) {
            infoPanel.classList.remove('hidden');
            sidebarIntro.classList.add('hidden');
        } else {
            infoPanel.classList.add('hidden');
            sidebarIntro.classList.remove('hidden');
        }
    }

    // UPDATED FUNCTION: This is the primary fix
    toggleSidebarBtn.addEventListener('click', function() {
        // This single line of code toggles the 'collapsed' class on the sidebar.
        // It correctly handles both collapsing and expanding the sidebar.
        sidebar.classList.toggle('collapsed');
        
        // Update the button icon based on the new state
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        } else {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        }
    });

    toggleThemeBtn.addEventListener('click', function() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode', !isDarkMode);

        const icon = this.querySelector('i');
        if (isDarkMode) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            map.removeLayer(lightTileLayer);
            darkTileLayer.addTo(map);
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            map.removeLayer(darkTileLayer);
            lightTileLayer.addTo(map);
        }
    });

    if (document.body.classList.contains('dark-mode')) {
        toggleThemeBtn.querySelector('i').classList.add('fa-moon');
    } else {
        toggleThemeBtn.querySelector('i').classList.add('fa-sun');
    }

    async function fetchWikipediaData(topic) {
        try {
            const response = await fetch(`https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
            if (!response.ok) {
                return { title: null, extract: null, thumbnail: null };
            }
            const data = await response.json();
            return {
                title: data.title,
                extract: data.extract,
                thumbnail: data.thumbnail ? data.thumbnail.source : null
            };
        } catch (error) {
            console.error("Failed to fetch data:", error);
            return { title: null, extract: null, thumbnail: null };
        }
    }

    async function displaySiteDetails(site) {
        toggleInfoPanel(true);
        const result = await fetchWikipediaData(site.name_ar);

        document.getElementById('panel-title').textContent = result.title || site.name_ar;
        document.getElementById('panel-story').textContent = result.extract || "لم يتم العثور على معلومات ويكيبيديا لهذا الموقع.";
        
        const cityInfoContainer = document.querySelector('.city-info-container');
        cityInfoContainer.innerHTML = '';
        if (result.thumbnail) {
            const imgElement = document.createElement('img');
            imgElement.src = result.thumbnail;
            imgElement.alt = result.title || site.name_ar;
            imgElement.style.maxWidth = '100%';
            imgElement.style.height = 'auto';
            imgElement.style.borderRadius = '8px';
            imgElement.style.marginTop = '1rem';
            cityInfoContainer.appendChild(imgElement);
        }

        if (!discoveredPathNames.has(site.name_ar)) {
            discoveredPathNames.add(site.name_ar);
        }
        updateCounter();
    }

    function createEmojiIcon(type) {
        let emoji;
        switch (type) {
            case 'archaeological':
                emoji = '💎';
                break;
            case 'city':
            case 'historical_city':
                emoji = '🏙️';
                break;
            case 'fort':
                emoji = '🏰';
                break;
            case 'historical_site':
                emoji = '🏛️';
                break;
            case 'route':
                emoji = '🛣️';
                break;
            case 'region':
                emoji = '🗺️';
                break;
            case 'island':
                emoji = '🏝️';
                break;
            default:
                emoji = '📍';
        }
        return L.divIcon({
            html: `<span class="emoji-text">${emoji}</span>`,
            className: 'emoji-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -25]
        });
    }

    function getTypeName(type) {
        switch (type) {
            case 'archaeological':
                return "موقع أثري";
            case 'city':
                return "مدينة";
            case 'historical_city':
                return "مدينة تاريخية";
            case 'fort':
                return "حصن/قصر";
            case 'historical_site':
                return "موقع تاريخي";
            case 'route':
                return "طريق تاريخي";
            case 'region':
                return "منطقة";
            case 'island':
                return "جزيرة";
            default:
                return "موقع";
        }
    }

    function generateLegend() {
        const types = [...new Set(historicalSites.map(site => site.type))];
        legendContainer.innerHTML = '<h4>مفتاح الخريطة</h4>';
        types.forEach(type => {
            const emoji = createEmojiIcon(type).options.html.match(/>(.*?)</)[1];
            const name = getTypeName(type);
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <div class="legend-label-group">
                    <span class="legend-icon">${emoji}</span>
                    <span class="legend-label">${name}</span>
                </div>
                <label class="switch">
                    <input type="checkbox" data-type="${type}" checked>
                    <span class="slider"></span>
                </label>
            `;
            legendContainer.appendChild(item);
        });
    }

    function setupLegendToggles() {
        document.querySelectorAll('.legend-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const type = e.target.dataset.type;
                if (e.target.checked) {
                    map.addLayer(markerLayerGroups[type]);
                } else {
                    map.removeLayer(markerLayerGroups[type]);
                }
            });
        });
    }

    function displayAllSites() {
        const cityInfoContainer = document.querySelector('.city-info-container');
        cityInfoContainer.innerHTML = '';
        
        // Initialize all marker layer groups
        const types = [...new Set(historicalSites.map(site => site.type))];
        types.forEach(type => {
            markerLayerGroups[type] = L.layerGroup().addTo(map);
        });

        historicalSites.forEach(site => {
            const customIcon = createEmojiIcon(site.type);
            const marker = L.marker([site.lat, site.lng], { icon: customIcon });
            marker.bindPopup(`<b>${site.name_ar}</b>`);
            marker.on('click', () => {
                displaySiteDetails(site);
            });
            // Add marker to its specific layer group
            if (markerLayerGroups[site.type]) {
                markerLayerGroups[site.type].addLayer(marker);
            }
            
            const siteDiv = document.createElement('div');
            siteDiv.className = 'city-info';
            const siteHeading = document.createElement('h4');
            siteHeading.className = 'city-heading';
            siteHeading.textContent = site.name_ar;
            siteDiv.appendChild(siteHeading);
            
            siteDiv.addEventListener('click', () => {
                map.flyTo([site.lat, site.lng], 8);
                displaySiteDetails(site);
            });
            cityInfoContainer.appendChild(siteDiv);
        });

        document.getElementById('paths-discovered-count').textContent = historicalSites.length;
    }

    function updateCounter() {
        document.getElementById('paths-discovered-count').textContent = discoveredPathNames.size;
    }
    
    // Call these functions on load
    displayAllSites();
    generateLegend();
    setupLegendToggles();

    // Updated Instructions
    sidebarIntro.innerHTML = `
        <h3>كيفية استخدام الخريطة</h3>
        <p>
            هذه الخريطة التفاعلية تسمح لك باستكشاف المواقع التاريخية في المملكة العربية السعودية.
        </p>
        <ul style="padding-right: 20px; text-align: right;">
            <li><strong>الخريطة الرئيسية:</strong> انقر على أي أيقونة على الخريطة لعرض تفاصيل عنها في اللوحة الجانبية. يمكنك تكبير وتصغير الخريطة باستخدام أزرار (+) و (-).</li>
            <li><strong>اللوحة الجانبية:</strong> عند النقر على أيقونة، ستظهر هنا معلومات مفصلة. يمكنك توسيع اللوحة الجانبية بالنقر على زر السهم لتوفير مساحة أكبر للقراءة.</li>
            <li><strong>مفتاح الخريطة:</strong> يقع في الزاوية العلوية اليسرى من الخريطة. يمكنك استخدامه لإظهار أو إخفاء أنواع معينة من المواقع (مثل المدن، المواقع الأثرية، إلخ) عبر تشغيل وإيقاف المفتاح.</li>
        </ul>
    `;
});
