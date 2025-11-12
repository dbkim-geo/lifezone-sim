// Global variables for OpenLayers and state management
let activeMaps = []; // Array to hold all active ol.Map instances
let vectorSource; // Reusable source for all vector layers
let currentLevel = 'basic'; // 'basic' for 기초생활권, 'regional' for 지역생활권
let radarCharts = {}; // Object to hold radar charts for each map (key: mapId, value: Chart instance)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Firestore placeholder

// --- MOCK DATA STRUCTURES ---
// Helper to generate numbered indicators
const genIndicators = (baseName, count, start = 1) =>
    Array.from({ length: count }, (_, i) => `${baseName}${start + i}`);

const MOCK_DATA = {
    basic: {
        levelName: "기초생활권",
        categories: {
            // 기본현황 20종
            "기본현황": [
                ...genIndicators("기본현황", 2, 1).map(name => `${name} (인구/고령화)`),
                ...genIndicators("기본현황", 18, 3).map(name => `${name} (현황)`),
            ],
            // 콤팩트성 4종
            "콤팩트성": genIndicators("콤팩트성", 4).map(name => `${name} (집약도)`),
            // 네트워크성 6종
            "네트워크성": genIndicators("네트워크성", 6).map(name => `${name} (접근성)`),
            // 생활편리성 4종
            "생활편리성": genIndicators("생활편리성", 4).map(name => `${name} (편의성)`),
        },
        indicatorSchema: { // For Radar Chart labels (Overall categories, used for collecting ALL indicators)
            "기본현황": 20, "콤팩트성": 4, "네트워크성": 6, "생활편리성": 4
        }
    },
    regional: {
        levelName: "지역생활권",
        categories: {
            // 기본현황 6종
            "기본현황": genIndicators("기본현황", 6).map(name => `${name} (총량)`),
            // 콤팩트성 4종
            "콤팩트성": genIndicators("콤팩트성", 4).map(name => `${name} (균형)`),
            // 네트워크성 6종
            "네트워크성": genIndicators("네트워크성", 6).map(name => `${name} (광역연계)`),
            // 생활편리성 5종
            "생활편리성": genIndicators("생활편리성", 5).map(name => `${name} (기관접근)`),
        },
        indicatorSchema: { // For Radar Chart labels (Overall categories, used for collecting ALL indicators)
            "기본현황": 6, "콤팩트성": 4, "네트워크성": 6, "생활편리성": 5
        }
    }
};

// Function to flatten all indicators for the current level
function getAllIndicators() {
    const data = MOCK_DATA[currentLevel];
    let allIndicators = [];
    for (const category in data.categories) {
        allIndicators = allIndicators.concat(data.categories[category]);
    }
    return allIndicators;
}


// Mock GeoJSON data (simple square features for demonstration)
const mockGeoJson = {
    'type': 'FeatureCollection',
    'crs': { 'type': 'name', 'properties': { 'name': 'EPSG:3857' } },
    'features': [
        // Mock features must contain property names matching the expanded MOCK_DATA keys for "기본현황1 (인구/고령화)" etc.
        // NOTE: Only a few properties are mocked here for brevity; the rest are randomly generated on click.
        { 'type': 'Feature', 'geometry': { 'type': 'Polygon', 'coordinates': [[[13945000, 4500000], [14000000, 4500000], [14000000, 4550000], [13945000, 4550000], [13945000, 4500000]]] }, 'properties': { 'fid': 1, '지역명': '강남권역', '기본현황1 (인구/고령화)': 85, '콤팩트성1 (집약도)': 70, '네트워크성1 (접근성)': 90, '생활편리성1 (편의성)': 60 } },
        { 'type': 'Feature', 'geometry': { 'type': 'Polygon', 'coordinates': [[[13890000, 4500000], [13945000, 4500000], [13945000, 4550000], [13890000, 4550000], [13890000, 4500000]]] }, 'properties': { 'fid': 2, '지역명': '강북권역', '기본현황1 (인구/고령화)': 40, '콤팩트성1 (집약도)': 55, '네트워크성1 (접근성)': 60, '생활편리성1 (편의성)': 75 } },
        { 'type': 'Feature', 'geometry': { 'type': 'Polygon', 'coordinates': [[[13945000, 4550000], [14000000, 4550000], [14000000, 4600000], [13945000, 4600000], [13945000, 4550000]]] }, 'properties': { 'fid': 3, '지역명': '영남권역', '기본현황1 (인구/고령화)': 65, '콤팩트성1 (집약도)': 80, '네트워크성1 (접근성)': 75, '생활편리성1 (편의성)': 50 } },
        { 'type': 'Feature', 'geometry': { 'type': 'Polygon', 'coordinates': [[[13890000, 4550000], [13945000, 4550000], [13945000, 4600000], [13890000, 4600000], [13890000, 4550000]]] }, 'properties': { 'fid': 4, '지역명': '호남권역', '기본현황1 (인구/고령화)': 30, '콤팩트성1 (집약도)': 45, '네트워크성1 (접근성)': 50, '생활편리성1 (편의성)': 85 } }
    ]
};

// --- OPENLAYERS FUNCTIONS ---

/**
 * Initialize the common vector source on first load.
 */
function initVectorSource() {
    if (!vectorSource) {
        vectorSource = new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(mockGeoJson, {
                featureProjection: 'EPSG:3857'
            })
        });
    }
}

/**
 * Generates a random color for a feature based on a mock value (0-100).
 * @param {number} value Indicator value (0-100)
 * @returns {string} Hex color string
 */
function getColor(value) {
    // Simple color gradient: Blue (Low) -> Yellow (Mid) -> Red (High)
    const normalized = Math.min(100, Math.max(0, value)) / 100;
    let r, g, b;

    if (normalized < 0.5) {
        // Blue to Yellow transition (0.0 to 0.5)
        r = Math.round(255 * 2 * normalized);
        g = Math.round(255 * 2 * normalized);
        b = Math.round(255 - 255 * 2 * normalized);
    } else {
        // Yellow to Red transition (0.5 to 1.0)
        r = 255;
        g = Math.round(255 * (1 - 2 * (normalized - 0.5)));
        b = 0;
    }

    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

/**
 * Default style for features (No selection yet).
 * @returns {ol.style.Style}
 */
function defaultStyleFunction() {
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(50, 50, 50, 0.5)',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(200, 200, 200, 0.3)'
        })
    });
}

/**
 * Dynamic style function based on a specific indicator.
 * @param {string} indicatorKey The property name (indicator) to visualize.
 * @returns {ol.style.StyleFunction}
 */
function createIndicatorStyleFunction(indicatorKey) {
    return function (feature) {
        // Find the property key that starts with the indicator's main category/name
        let keyToUse = indicatorKey;
        if (!feature.get(indicatorKey)) {
            // Fallback logic to find the closest matching key in mock data
            keyToUse = Object.keys(feature.getProperties()).find(k => k.startsWith(indicatorKey.split(' ')[0])) || indicatorKey;
        }

        const value = feature.get(keyToUse) || Math.floor(Math.random() * 100);
        const color = getColor(value);

        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.7)',
                width: 1.5
            }),
            fill: new ol.style.Fill({
                color: color + 'CC' // Add transparency (CC = ~80%)
            }),
            text: new ol.style.Text({
                text: feature.get('지역명'),
                font: '14px Noto Sans',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 3 })
            })
        });
    };
}

/**
 * Create and initialize a single OpenLayers map.
 * @param {string} targetId The ID of the div element to render the map into.
 * @param {string} indicatorKey The indicator to visualize on this map.
 * @param {ol.View | null} masterView The view to link to for synchronization. If null, a new view is created.
 * @returns {ol.Map} The created map instance.
 */
function createSingleMap(targetId, indicatorKey, masterView = null) {
    // 1. Create Vector Layer
    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: createIndicatorStyleFunction(indicatorKey),
        zIndex: 1
    });

    // 2. Determine View: Use masterView if provided, otherwise create a new one.
    const view = masterView || new ol.View({
        center: ol.proj.fromLonLat([127.5, 36.5]),
        zoom: 7
    });

    // 3. Create Map Instance
    const newMap = new ol.Map({
        target: targetId,
        layers: [
            new ol.layer.Tile({ source: new ol.source.OSM(), zIndex: 0 }), // Base Layer
            vectorLayer
        ],
        view: view // Use the shared view or the newly created one
    });

    // 4. Attach click handler for feature info
    newMap.on('singleclick', handleMapClick);

    // 5. Fit view to data extent (ONLY if it's the master view/newly created view)
    if (!masterView) {
        newMap.getView().fit(vectorSource.getExtent(), { padding: [20, 20, 20, 20], duration: 500 });
    }

    return newMap;
}


/**
 * Handles feature click event and updates Radar Chart for the specific map.
 * @param {ol.MapBrowserEvent} event
 */
function handleMapClick(event) {
    const mapInstance = event.map;
    const mapTarget = mapInstance.getTarget();
    const mapId = typeof mapTarget === 'string' ? mapTarget : mapTarget.id;

    const hit = mapInstance.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        return feature; // Return the first feature found
    });

    if (hit) {
        const regionName = hit.get('지역명');
        const props = hit.getProperties();

        console.log('Feature Clicked:', regionName, props);
        // Update Radar Chart for this specific map with selected feature data
        updateRadarChartWithFeature(mapId, regionName, props);
    } else {
        console.log('No feature clicked.');
        resetRadarChart(mapId);
    }
}

// --- UI & STATE MANAGEMENT FUNCTIONS (jQuery) ---

/**
 * Updates the list of selectable indicators based on the living area level.
 */
function updateIndicatorsUI() {
    const data = MOCK_DATA[currentLevel];
    const $container = $('#indicator-selection');
    $container.empty();

    for (const category in data.categories) {
        const indicators = data.categories[category];

        // Start of a new category block with aesthetic improvements
        let categoryHtml = `
            <div class="category-block mb-6 last:mb-0 p-3 border border-gray-200 rounded-xl shadow-inner bg-gray-50">
                <p class="text-sm font-bold text-indigo-800 mb-3 border-b border-indigo-200 pb-1">${category} (${indicators.length}종)</p>
                <!-- Responsive Grid for indicators: 2 columns on all screens -->
                <div class="grid grid-cols-2 gap-x-3 gap-y-2">
        `;

        indicators.forEach(indicator => {
            // Replace special characters in indicator name for valid HTML ID
            const id = `chk-${indicator.replace(/[\s\(\)\/]/g, '_')}`;
            categoryHtml += `
                <div class="flex items-center">
                    <input id="${id}" type="checkbox" name="indicator" value="${indicator}" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer">
                    <!-- Use text-xs for smaller font and title for full name, truncate long names -->
                    <label for="${id}" class="ml-2 block text-xs text-gray-800 cursor-pointer truncate" title="${indicator}">${indicator}</label>
                </div>
            `;
        });

        categoryHtml += `</div></div>`;
        $container.append(categoryHtml);
    }

    // Limit checkbox selection to 4
    $('input[name="indicator"]').on('change', function () {
        const checkedCount = $('input[name="indicator"]:checked').length;
        if (checkedCount > 4) {
            this.checked = false;
            displayMessage('경고', '최대 4개의 지표만 선택 가능합니다.');
        }
    });
}

/**
 * Displays a custom message box instead of alert.
 * @param {string} title
 * @param {string} message
 */
function displayMessage(title, message) {
    // Create a simple modal/message box dynamically
    const $modal = $(`
        <div id="custom-alert" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center transition-opacity duration-300 opacity-0" style="z-index: 9999;">
            <div class="bg-white p-6 rounded-lg shadow-2xl w-80 transform scale-95 transition-transform duration-300">
                <h3 class="text-lg font-bold ${title === '경고' ? 'text-red-600' : 'text-blue-600'} mb-3">${title}</h3>
                <p class="text-sm text-gray-700 mb-4">${message}</p>
                <button class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg" onclick="$('#custom-alert').remove()">확인</button>
            </div>
        </div>
    `);
    $('body').append($modal);
    setTimeout(() => $modal.css('opacity', 1).find('> div').css('transform', 'scale(100%)'), 10);
}

/**
 * Toggles the living area level (기초/지역).
 */
$('#living-area-toggle').on('click', 'button', function () {
    const selectedLevel = $(this).data('level');
    if (currentLevel === selectedLevel) return;

    // Update UI state
    $('#living-area-toggle button').removeClass('bg-indigo-600 text-white shadow-md hover:bg-gray-200 text-gray-700')
        .addClass('text-gray-700 hover:bg-gray-200');
    $(this).removeClass('text-gray-700 hover:bg-gray-200')
        .addClass('bg-indigo-600 text-white shadow-md');

    currentLevel = selectedLevel;
    updateIndicatorsUI();

    // Re-render map/chart for new default state
    visualizeMap(); // Will reset map to a single view if needed
});


/**
 * '시각화하기' button handler. Implements map splitting and ensures correct grid layout.
 */
$('#visualize-button').on('click', visualizeMap);

function visualizeMap() {
    // Destroy all existing maps and charts before starting
    activeMaps.forEach(map => map.setTarget(null));
    activeMaps = [];

    // Destroy all existing radar charts
    Object.keys(radarCharts).forEach(mapId => {
        if (radarCharts[mapId]) {
            radarCharts[mapId].destroy();
        }
    });
    radarCharts = {};

    const allSelectedIndicators = $('input[name="indicator"]:checked').map(function () {
        return $(this).val();
    }).get();

    // 체크된 항목 개수에 따라 자동으로 지도 개수 결정
    const checkedCount = allSelectedIndicators.length;
    let numMapsToShow;

    if (checkedCount === 0) {
        numMapsToShow = 1; // 기본값: 1개
    } else {
        numMapsToShow = checkedCount; // 체크된 개수만큼 표시
    }

    const indicatorsToDisplay = allSelectedIndicators.slice(0, numMapsToShow);

    if (indicatorsToDisplay.length === 0) {
        // Fallback to a single, default grey map (if 0 selected)
        indicatorsToDisplay.push('기본현황1 (인구/고령화)'); // Use a default key for the single grey map
    }

    console.log(`Displaying ${numMapsToShow} map(s) with indicators:`, indicatorsToDisplay);

    const $mapContainer = $('#map-container');
    $mapContainer.empty();

    // === 1. 지도 컨테이너 레이아웃 설정 (체크된 개수에 따라 자동 결정) ===
    let gridLayout = '';
    // Tailwind CSS classes for grid layout
    if (numMapsToShow === 1) {
        gridLayout = 'grid-cols-1 grid-rows-1'; // 1개: 1x1
    } else if (numMapsToShow === 2) {
        gridLayout = 'grid-cols-2 grid-rows-1'; // 2개: 좌우 분할 (1x2)
    } else if (numMapsToShow === 3) {
        gridLayout = 'grid-cols-2 grid-rows-2'; // 3개: 2x2 그리드에 3개 배치
    } else if (numMapsToShow === 4) {
        gridLayout = 'grid-cols-2 grid-rows-2'; // 4개: 2x2 분할
    }
    // Add h-full back to ensure it takes available height
    $mapContainer.attr('class', `h-full grid gap-1 ${gridLayout}`);

    // === 2. 지도 생성 및 시각화 ===
    let masterView = null; // 마스터 뷰를 저장할 변수

    for (let i = 0; i < numMapsToShow; i++) {
        const mapId = `map-${i + 1}`;
        const indicatorKey = indicatorsToDisplay[i];

        // Create wrapper and map div with title and chart overlay
        const mapHtml = `
            <div id="${mapId}-wrapper" class="map-wrapper">
                <div id="${mapId}" class="map flex-grow">
                    <div class="map-title-overlay" title="${indicatorKey}">
                        지도 ${i + 1}: ${indicatorKey}
                    </div>
                    <div class="radar-chart-overlay">
                        <canvas id="radarChart-${i + 1}"></canvas>
                    </div>
                </div>
            </div>
        `;
        $mapContainer.append(mapHtml);

        // Initialize OpenLayers Map
        const key = (allSelectedIndicators.length === 0 && i === 0) ? 'DEFAULT_GREY' : indicatorKey;

        let newMap;
        if (i === 0) {
            // 첫 번째 지도(마스터)를 생성하고 뷰를 저장합니다.
            newMap = createSingleMap(mapId, key, null); // masterView = null, so it creates a new ol.View
            masterView = newMap.getView();
        } else {
            // 나머지 지도는 마스터 뷰를 공유하도록 생성합니다.
            newMap = createSingleMap(mapId, key, masterView);
        }

        activeMaps.push(newMap);

        // For the default state (0 selected), manually apply the grey style
        if (allSelectedIndicators.length === 0 && i === 0) {
            newMap.getLayers().getArray().find(layer => layer instanceof ol.layer.Vector).setStyle(defaultStyleFunction);
        }

        // Manually trigger map resize/render after DOM manipulation
        // This is crucial for OpenLayers in dynamic layouts
        setTimeout(() => {
            newMap.updateSize();
            // Initialize radar chart for this map
            initRadarChartForMap(mapId);
        }, 100);
    }

    // // Display message based on the outcome
    // if (allSelectedIndicators.length === 0) {
    //     displayMessage('알림', '선택된 지표가 없어 기본 현황(1개 지도)으로 초기화했습니다.');
    // } else {
    //     displayMessage('성공', `${numMapsToShow}개의 지표를 ${numMapsToShow}개 지도로 분할하여 시각화했습니다. 지도 뷰가 동기화되었습니다.`);
    // }
}

// --- CHART.JS FUNCTIONS ---

/**
 * Generates mock data for the radar chart (Individual Indicator Characteristics).
 * @returns {Object} object containing labels and data arrays
 */
function generateIndividualMockData() {
    const labels = getAllIndicators();
    const totalCount = labels.length;

    // Generate random normalized values (e.g., score 0-100)
    const scores = labels.map(() => Math.floor(Math.random() * 50) + 50); // 50 to 100 range for 'Overall'

    return { labels: labels, data: scores, totalCount: totalCount };
}

/**
 * Initialize or reset the Radar Chart for a specific map.
 * @param {string} mapId The ID of the map (e.g., 'map-1')
 */
function initRadarChartForMap(mapId) {
    // Extract chart number from mapId (e.g., 'map-1' -> '1')
    const chartNum = mapId.replace('map-', '');
    const chartId = `radarChart-${chartNum}`;

    // Destroy existing chart if it exists
    if (radarCharts[mapId]) {
        radarCharts[mapId].destroy();
    }

    const canvas = document.getElementById(chartId);
    if (!canvas) {
        console.warn(`Chart canvas not found: ${chartId}`);
        return;
    }

    const ctx = canvas.getContext('2d');
    const mockData = generateIndividualMockData();

    radarCharts[mapId] = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: mockData.labels, // ALL 34 or 21 indicators become the labels
            datasets: [{
                label: `${MOCK_DATA[currentLevel].levelName} 전체 평균`,
                data: mockData.data,
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // Indigo 500 w/ opacity
                borderColor: 'rgb(59, 130, 246)',
                pointRadius: 1, // Reduce point size due to high number of points
                pointHitRadius: 5,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(59, 130, 246)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    pointLabels: {
                        font: { size: 6 }, // Very small font size for 34 labels
                        padding: 3,
                        callback: function (label) {
                            // Shorten labels dramatically to prevent overlap (e.g., show only Indicator Name)
                            return label.split(' ')[0];
                        }
                    },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 8 },
                        boxWidth: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            // Show full label in tooltip
                            return context.dataset.label + ' (' + context.label + '): ' + context.parsed.r + '점';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Update Radar Chart with the selected feature's data for a specific map.
 * @param {string} mapId The ID of the map
 * @param {string} regionName
 * @param {Object} props Feature properties
 */
function updateRadarChartWithFeature(mapId, regionName, props) {
    const chart = radarCharts[mapId];
    if (!chart) {
        console.warn(`Chart not found for map: ${mapId}`);
        return;
    }

    const allIndicators = getAllIndicators();

    // Generate mock scores for the selected feature for ALL 34/21 indicators
    const featureScores = allIndicators.map(indicatorKey => {
        // In a real app, you would look up props[indicatorKey]
        // Here, we generate a random score (0-100) as mock data
        return Math.floor(Math.random() * 100);
    });

    // Check if the feature dataset already exists and remove it
    if (chart.data.datasets.length > 1) {
        chart.data.datasets.pop();
    }

    // Add the new feature dataset
    chart.data.datasets.push({
        label: `${regionName} 특성`,
        data: featureScores,
        backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red 500 w/ opacity
        borderColor: 'rgb(239, 68, 68)',
        pointRadius: 1,
        pointHitRadius: 5,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(239, 68, 68)'
    });

    chart.update();
}

/**
 * Reset Radar Chart to show only the overall average for a specific map.
 * @param {string} mapId The ID of the map
 */
function resetRadarChart(mapId) {
    const chart = radarCharts[mapId];
    if (!chart) {
        return;
    }

    if (chart.data.datasets.length > 1) {
        chart.data.datasets.pop();
        chart.update();
    }
}

// --- MODAL FUNCTIONS ---

/**
 * Open the intent modal
 */
function openIntentModal() {
    const $modal = $('#intent-modal');
    $modal.removeClass('hidden');
    setTimeout(() => {
        $modal.find('> div').css('transform', 'scale(100%)');
    }, 10);
}

/**
 * Close the intent modal
 */
function closeIntentModal() {
    const $modal = $('#intent-modal');
    $modal.find('> div').css('transform', 'scale(95%)');
    setTimeout(() => {
        $modal.addClass('hidden');
    }, 300);
}

// --- INITIALIZATION ---
$(document).ready(function () {
    // 1. Initialize Vector Source
    initVectorSource();

    // 2. Initialize Control Panel UI (Default: Basic)
    updateIndicatorsUI();

    // 3. Set initial map visualization (Default: Basic/기본현황 중 1개 표시)
    // Select the first indicator and visualize it as a single map
    const firstIndicator = MOCK_DATA.basic.categories["기본현황"][0];
    // Replace special characters in indicator name for valid HTML ID
    const safeId = `#chk-${firstIndicator.replace(/[\s\(\)\/]/g, '_')}`;

    setTimeout(() => {
        // Check the default indicator and run visualization
        $(safeId).prop('checked', true);
        visualizeMap();
    }, 500);

    // 4. Initialize Intent Modal handlers
    $('#intent-modal-btn').on('click', openIntentModal);
    $('#intent-modal-close').on('click', closeIntentModal);

    // Close modal when clicking outside
    $('#intent-modal').on('click', function (e) {
        if (e.target === this) {
            closeIntentModal();
        }
    });
});

