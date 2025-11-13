// Global variables for OpenLayers and state management
let activeMaps = []; // Array to hold all active ol.Map instances
let currentScenarioIndex = 0; // Current scenario index for navigation
let selectedScenarios = []; // Array of selected scenario keys
let isCompareMode = false; // Whether in compare mode (split screen)
let barCharts = {}; // Object to hold bar charts for each map

// GeoServer configuration (loaded from config.js)
const GEOSERVER_URL = typeof window !== 'undefined' && window.GEOSERVER_URL
    ? window.GEOSERVER_URL
    : 'http://localhost:8088/geoserver';
const GEOSERVER_WORKSPACE = typeof window !== 'undefined' && window.GEOSERVER_WORKSPACE
    ? window.GEOSERVER_WORKSPACE
    : 'lifesim';

// Scenario layer mapping
// Format: { scenario: { regionalCount: layerName } }
// scenario: 'm1' (콤팩트성 확보), 'm2' (콤팩트성 확보 및 배후 인구규모 확보), 'm3' (콤팩트성 및 네트워크성 동시 확보)
// regionalCount: '5' or '6'
const SCENARIO_LAYERS = {
    m1: {
        '5': 'future_scenario_m1_k5',
        '6': 'future_scenario_m1_k6'
    },
    m2: {
        '5': 'future_scenario_m2_k5',
        '6': 'future_scenario_m2_k6'
    },
    m3: {
        '5': 'future_scenario_m3_k5',
        '6': 'future_scenario_m3_k6'
    }
};

// Population layer
const POPULATION_LAYER = 'future_population_2040';

// Scenario attribute mapping
const SCENARIO_ATTRIBUTES = {
    'c_pop40_ratio': '중심지 인구 집중도',
    '1h_nc_ratio': '중심지 주변 연결성',
    '1h_over_pop_ratio': '중심지 접근의 형평성'
};

// Scenario name mapping
const SCENARIO_NAMES = {
    'm1': '콤팩트성 확보',
    'm2': '콤팩트성 확보 및 배후 인구규모 확보',
    'm3': '콤팩트성 및 네트워크성 동시 확보'
};

// --- OPENLAYERS FUNCTIONS ---


/**
 * Fetch layer extent from GeoServer GetCapabilities
 * @param {string} layerName Full layer name (workspace:layer)
 * @returns {Promise<Array>} Promise resolving to extent [minX, minY, maxX, maxY]
 */
async function getLayerExtentFromCapabilities(layerName) {
    try {
        const capabilitiesUrl = `${GEOSERVER_URL}/wms?service=WMS&version=1.1.0&request=GetCapabilities`;
        const response = await fetch(capabilitiesUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');

        let layers = xml.querySelectorAll('Layer > Layer');
        if (layers.length === 0) {
            layers = xml.querySelectorAll('Layer');
        }

        for (const layer of layers) {
            const nameElement = layer.querySelector('Name');
            const layerNameText = nameElement ? nameElement.textContent.trim() : '';

            if (layerNameText === layerName || layerNameText.endsWith(':' + layerName.split(':')[1])) {
                const firstBbox = layer.querySelector('BoundingBox');
                if (firstBbox) {
                    const minX = parseFloat(firstBbox.getAttribute('minx'));
                    const minY = parseFloat(firstBbox.getAttribute('miny'));
                    const maxX = parseFloat(firstBbox.getAttribute('maxx'));
                    const maxY = parseFloat(firstBbox.getAttribute('maxy'));
                    return [minX, minY, maxX, maxY];
                }
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Create and initialize a single OpenLayers map with GeoServer WMS layer.
 * @param {string} targetId The ID of the div element to render the map into.
 * @param {string} layerName Layer name to display
 * @param {ol.View | null} masterView The view to link to for synchronization. If null, a new view is created.
 * @returns {ol.Map} The created map instance.
 */
function createSingleMap(targetId, layerName, masterView = null) {
    const fullLayerName = `${GEOSERVER_WORKSPACE}:${layerName}`;

    // Create WMS Image Layer with EPSG:5179
    const wmsSource = new ol.source.ImageWMS({
        url: `${GEOSERVER_URL}/wms`,
        params: {
            'LAYERS': fullLayerName,
            'TILED': false,
            'VERSION': '1.1.0',
            'FORMAT': 'image/png',
            'TRANSPARENT': true,
            'SRS': 'EPSG:5179'
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
    });

    const wmsLayer = new ol.layer.Image({
        source: wmsSource,
        zIndex: 1,
        opacity: 1.0
    });

    // Determine View: Use masterView if provided, otherwise create a new one.
    const view = masterView || new ol.View({
        projection: 'EPSG:5179',
        center: [975000, 1650000],
        zoom: 9
    });

    // Create Map Instance
    const newMap = new ol.Map({
        target: targetId,
        layers: [wmsLayer],
        view: view
    });

    // Add error handling for WMS layer
    wmsLayer.getSource().on('imageloaderror', function (event) {
        const source = wmsLayer.getSource();
        try {
            const extent = event.extent || newMap.getView().calculateExtent();
            const resolution = event.resolution || newMap.getView().getResolution();
            const params = source.getParams();
            const url = source.getUrl() + '?' + new URLSearchParams({
                service: 'WMS',
                version: params.VERSION || '1.1.0',
                request: 'GetMap',
                layers: params.LAYERS,
                styles: params.STYLES || '',
                format: params.FORMAT || 'image/png',
                transparent: params.TRANSPARENT || 'true',
                srs: params.SRS || 'EPSG:5179',
                bbox: extent.join(','),
                width: Math.round((extent[2] - extent[0]) / resolution),
                height: Math.round((extent[3] - extent[1]) / resolution)
            }).toString();
        } catch (err) {
            // Silent error handling
        }
    });

    // Attach click handler for feature info
    newMap.set('layerName', layerName);
    newMap.on('singleclick', function (evt) {
        handleMapClickWithWMS(evt, newMap, targetId, fullLayerName);
    });

    // Fetch actual extent from GetCapabilities and fit view
    if (!masterView) {
        getLayerExtentFromCapabilities(fullLayerName).then(extent => {
            if (extent) {
                newMap.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500 });
            } else {
                const defaultExtent = [900000, 1550000, 1050000, 1750000];
                newMap.getView().fit(defaultExtent, { padding: [50, 50, 50, 50], duration: 500 });
            }
        });
    }

    return newMap;
}

/**
 * Handles feature click event using WMS GetFeatureInfo
 * @param {ol.MapBrowserEvent} event
 * @param {ol.Map} mapInstance
 * @param {string} mapId
 * @param {string} layerName Full layer name (workspace:layer)
 */
async function handleMapClickWithWMS(event, mapInstance, mapId, layerName) {
    const viewResolution = mapInstance.getView().getResolution();
    const wmsLayer = mapInstance.getLayers().getArray().find(layer =>
        layer instanceof ol.layer.Image && layer.getSource() instanceof ol.source.ImageWMS
    );

    if (!wmsLayer) {
        hideAttributePopup();
        removeFeatureHighlight(mapInstance);
        return;
    }

    const url = wmsLayer.getSource().getFeatureInfoUrl(
        event.coordinate,
        viewResolution,
        'EPSG:5179',
        {
            'INFO_FORMAT': 'application/json',
            'FEATURE_COUNT': 1
        }
    );

    if (url) {
        fetch(url)
            .then(response => response.json())
            .then(async (data) => {
                if (data.features && data.features.length > 0) {
                    const feature = data.features[0];
                    const props = feature.properties;

                    // Highlight the clicked feature
                    highlightClickedFeature(mapInstance, feature.geometry);

                    // Show attribute popup
                    showAttributePopup(event.coordinate, mapInstance, props);

                    // Update bar chart with clicked feature data
                    const regionName = props.nm || props.name || props.지역명 || props.NAME || '지역';
                    await updateBarChartWithFeature(mapId, regionName, props);
                } else {
                    hideAttributePopup();
                    removeFeatureHighlight(mapInstance);
                    resetBarChart(mapId);
                }
            })
            .catch(error => {
                hideAttributePopup();
                removeFeatureHighlight(mapInstance);
            });
    } else {
        hideAttributePopup();
        removeFeatureHighlight(mapInstance);
    }
}

// Global variables for feature highlight
let highlightOverlay = null;

/**
 * Highlight the clicked feature with an overlay
 * @param {ol.Map} map Map instance
 * @param {Object} geometry Feature geometry from GeoJSON
 */
function highlightClickedFeature(map, geometry) {
    removeFeatureHighlight(map);

    const vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: geometry
            }]
        }, {
            featureProjection: 'EPSG:5179'
        })
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#00ff88',
                width: 5,
                lineCap: 'round',
                lineJoin: 'round'
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 136, 0.15)'
            })
        }),
        zIndex: 1000
    });

    const glowStyle = [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 255, 200, 0.6)',
                width: 9,
                lineCap: 'round',
                lineJoin: 'round'
            })
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 255, 150, 0.8)',
                width: 7,
                lineCap: 'round',
                lineJoin: 'round'
            })
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#00ff88',
                width: 5,
                lineCap: 'round',
                lineJoin: 'round'
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 136, 0.15)'
            })
        })
    ];

    vectorLayer.setStyle(glowStyle);
    map.addLayer(vectorLayer);
    highlightOverlay = vectorLayer;
}

/**
 * Remove feature highlight
 * @param {ol.Map} map Map instance
 */
function removeFeatureHighlight(map) {
    if (highlightOverlay) {
        map.removeLayer(highlightOverlay);
        highlightOverlay = null;
    }
}

// --- UI & STATE MANAGEMENT FUNCTIONS ---

/**
 * Initialize UI with default values
 */
function initializeUI() {
    // 2040년 장래인구분포: Off (기본값)
    $('#population-2040-toggle').prop('checked', false);
    $('#population-2040-label').text('Off');

    // 지역생활권수: 5 (기본값)
    $('#regional-count-select').val('5');

    // 공간구조목표 시나리오: 콤팩트성 확보만 선택 (기본값)
    selectedScenarios = ['m1'];
    updateScenarioButtons();
}

/**
 * Update scenario button states
 */
function updateScenarioButtons() {
    // m1 is always selected (disabled)
    $('#scenario-m1').addClass('bg-gradient-to-r from-sky-400 to-blue-400 text-white shadow-md shadow-sky-200')
        .removeClass('bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300')
        .prop('disabled', true);

    // Update m2 and m3 based on selection
    if (selectedScenarios.includes('m2')) {
        $('#scenario-m2').addClass('bg-gradient-to-r from-sky-400 to-blue-400 text-white shadow-md shadow-sky-200')
            .removeClass('bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300');
    } else {
        $('#scenario-m2').removeClass('bg-gradient-to-r from-sky-400 to-blue-400 text-white shadow-md shadow-sky-200')
            .addClass('bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300');
    }

    if (selectedScenarios.includes('m3')) {
        $('#scenario-m3').addClass('bg-gradient-to-r from-sky-400 to-blue-400 text-white shadow-md shadow-sky-200')
            .removeClass('bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300');
    } else {
        $('#scenario-m3').removeClass('bg-gradient-to-r from-sky-400 to-blue-400 text-white shadow-md shadow-sky-200')
            .addClass('bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300');
    }
}

/**
 * Get layer names for selected scenarios
 * @returns {Array} Array of layer names
 */
function getSelectedLayerNames() {
    const regionalCount = $('#regional-count-select').val();
    const layers = [];

    selectedScenarios.forEach(scenario => {
        if (SCENARIO_LAYERS[scenario] && SCENARIO_LAYERS[scenario][regionalCount]) {
            layers.push(SCENARIO_LAYERS[scenario][regionalCount]);
        }
    });

    return layers;
}

/**
 * Visualize simulation
 */
function visualizeSimulation() {
    // Destroy all existing maps and charts
    activeMaps.forEach(map => map.setTarget(null));
    activeMaps = [];

    Object.keys(barCharts).forEach(mapId => {
        if (barCharts[mapId]) {
            barCharts[mapId].destroy();
        }
    });
    barCharts = {};

    // Get selected layers
    const selectedLayers = getSelectedLayerNames();
    if (selectedLayers.length === 0) {
        return;
    }

    // Reset to first scenario
    currentScenarioIndex = 0;

    const $mapContainer = $('#map-container');
    $mapContainer.empty();

    // Create single map container with navigation arrows
    const mapId = 'map-1';
    const currentLayer = selectedLayers[currentScenarioIndex];
    const currentScenario = selectedScenarios[currentScenarioIndex];
    const scenarioName = SCENARIO_NAMES[currentScenario] || currentLayer;

    // Create map HTML with navigation arrows
    const mapHtml = `
        <div id="${mapId}-wrapper" class="map-wrapper relative h-full">
            ${selectedLayers.length > 1 ? `
                <button id="prev-scenario" class="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-sky-600 rounded-full p-2 shadow-md border border-sky-200 transition-all duration-200 ${currentScenarioIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:border-sky-300'}" title="이전 시나리오">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <button id="next-scenario" class="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-sky-600 rounded-full p-2 shadow-md border border-sky-200 transition-all duration-200 ${currentScenarioIndex === selectedLayers.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:border-sky-300'}" title="다음 시나리오">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            ` : ''}
            <div id="${mapId}" class="map h-full">
                <div class="map-title-overlay" title="${scenarioName}">
                    ${scenarioName} (${currentScenarioIndex + 1}/${selectedLayers.length})
                </div>
                <div class="bar-chart-overlay">
                    <canvas id="barChart-1"></canvas>
                </div>
            </div>
        </div>
    `;
    $mapContainer.attr('class', 'h-full');
    $mapContainer.append(mapHtml);

    // Create single map
    const newMap = createSingleMap(mapId, currentLayer, null);
    activeMaps.push(newMap);

    // Add population layer if enabled
    const showPopulation = $('#population-2040-toggle').is(':checked');
    if (showPopulation) {
        addPopulationLayer(newMap);
    }

    // Initialize bar chart
    setTimeout(async () => {
        newMap.updateSize();
        const chart = await initBarChartForMap(mapId);
        if (chart) {
            chart.map = newMap;
        }
    }, 100);

    // Setup navigation arrows
    if (selectedLayers.length > 1) {
        $('#prev-scenario').on('click', function() {
            if (currentScenarioIndex > 0) {
                currentScenarioIndex--;
                updateMapScenario();
            }
        });

        $('#next-scenario').on('click', function() {
            if (currentScenarioIndex < selectedLayers.length - 1) {
                currentScenarioIndex++;
                updateMapScenario();
            }
        });
    }
}

/**
 * Update map to show current scenario
 */
function updateMapScenario() {
    const selectedLayers = getSelectedLayerNames();
    if (selectedLayers.length === 0) return;

    const currentLayer = selectedLayers[currentScenarioIndex];
    const currentScenario = selectedScenarios[currentScenarioIndex];
    const scenarioName = SCENARIO_NAMES[currentScenario] || currentLayer;

    // Update map title
    $('.map-title-overlay').text(`${scenarioName} (${currentScenarioIndex + 1}/${selectedLayers.length})`);

    // Update WMS layer
    if (activeMaps.length > 0) {
        const map = activeMaps[0];
        const wmsLayer = map.getLayers().getArray().find(layer =>
            layer instanceof ol.layer.Image && layer.getSource() instanceof ol.source.ImageWMS
        );
        if (wmsLayer) {
            const fullLayerName = `${GEOSERVER_WORKSPACE}:${currentLayer}`;
            wmsLayer.getSource().updateParams({ 'LAYERS': fullLayerName });
            map.set('layerName', currentLayer);
        }
    }

    // Update navigation arrows
    if (selectedLayers.length > 1) {
        $('#prev-scenario').toggleClass('opacity-50 cursor-not-allowed', currentScenarioIndex === 0);
        $('#next-scenario').toggleClass('opacity-50 cursor-not-allowed', currentScenarioIndex === selectedLayers.length - 1);
    }

    // Update bar chart
    const mapId = 'map-1';
    if (barCharts[mapId]) {
        initBarChartForMap(mapId);
    }
}

/**
 * Add population layer to map (always on top)
 * @param {ol.Map} map Map instance
 */
function addPopulationLayer(map) {
    // Remove existing population layer if any
    const existingLayers = map.getLayers().getArray();
    existingLayers.forEach(layer => {
        if (layer.get('name') === POPULATION_LAYER) {
            map.removeLayer(layer);
        }
    });

    const fullLayerName = `${GEOSERVER_WORKSPACE}:${POPULATION_LAYER}`;
    
    const wmsSource = new ol.source.ImageWMS({
        url: `${GEOSERVER_URL}/wms`,
        params: {
            'LAYERS': fullLayerName,
            'TILED': false,
            'VERSION': '1.1.0',
            'FORMAT': 'image/png',
            'TRANSPARENT': true,
            'SRS': 'EPSG:5179'
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
    });

    const wmsLayer = new ol.layer.Image({
        source: wmsSource,
        zIndex: 1000, // Highest zIndex to ensure it's always on top
        opacity: 0.6
    });

    // Set name for identification
    wmsLayer.set('name', POPULATION_LAYER);

    // Add to the top of the layer stack (push adds to the end, which renders on top)
    map.getLayers().push(wmsLayer);
}

/**
 * Toggle compare mode (split screen)
 */
function toggleCompareMode() {
    isCompareMode = !isCompareMode;
    
    if (isCompareMode) {
        // Split screen mode - show 2 maps side by side
        // TODO: Implement split screen visualization
        $('#compare-button').addClass('bg-gradient-to-r from-sky-400 to-blue-400 text-white')
            .removeClass('bg-gray-200 text-gray-700');
    } else {
        // Single map mode
        $('#compare-button').removeClass('bg-gradient-to-r from-sky-400 to-blue-400 text-white')
            .addClass('bg-gray-200 text-gray-700');
        visualizeSimulation();
    }
}

// --- CHART.JS FUNCTIONS ---

/**
 * Initialize Bar Chart for a specific map
 * @param {string} mapId The ID of the map (e.g., 'map-1')
 */
async function initBarChartForMap(mapId) {
    const chartNum = mapId.replace('map-', '');
    const chartId = `barChart-${chartNum}`;

    // Destroy existing chart if it exists
    if (barCharts[mapId]) {
        barCharts[mapId].destroy();
    }

    const canvas = document.getElementById(chartId);
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');

    // Initialize empty bar chart
    barCharts[mapId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['중심지 인구 집중도', '중심지 주변 연결성', '중심지 접근의 형평성'],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });

    return barCharts[mapId];
}

/**
 * Update Bar Chart with the selected feature's data
 * @param {string} mapId The ID of the map
 * @param {string} regionName
 * @param {Object} props Feature properties
 */
async function updateBarChartWithFeature(mapId, regionName, props) {
    const chart = barCharts[mapId];
    if (!chart) {
        return;
    }

    // Get attribute values
    const values = [
        props.c_pop40_ratio !== undefined && props.c_pop40_ratio !== null ? parseFloat(props.c_pop40_ratio) : 0,
        props['1h_nc_ratio'] !== undefined && props['1h_nc_ratio'] !== null ? parseFloat(props['1h_nc_ratio']) : 0,
        props['1h_over_pop_ratio'] !== undefined && props['1h_over_pop_ratio'] !== null ? parseFloat(props['1h_over_pop_ratio']) : 0
    ];

    // Remove all existing datasets and add new one
    chart.data.datasets = [];
    chart.data.datasets.push({
        label: regionName,
        data: values,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
    });

    chart.update();
}

/**
 * Reset Bar Chart
 * @param {string} mapId The ID of the map
 */
function resetBarChart(mapId) {
    const chart = barCharts[mapId];
    if (!chart) {
        return;
    }

    chart.data.datasets = [];
    chart.update();
}

// --- ATTRIBUTE POPUP FUNCTIONS ---

let attributePopup = null;

/**
 * Show attribute information popup
 * @param {ol.Coordinate} coordinate Clicked coordinate
 * @param {ol.Map} map Map instance
 * @param {Object} properties Feature properties
 */
function showAttributePopup(coordinate, map, properties) {
    if (attributePopup) {
        const element = attributePopup.getElement();
        if (element) {
            if (attributePopup._hideTimeout) {
                clearTimeout(attributePopup._hideTimeout);
            }
            activeMaps.forEach(m => {
                if (m && attributePopup) {
                    m.removeOverlay(attributePopup);
                }
            });
        }
        attributePopup = null;
    }

    const regionName = properties.nm || properties.name || properties.지역명 || properties.NAME || '지역';

    let content = `<div class="attribute-popup-content">`;
    content += `<h3 class="attribute-popup-title">${regionName}</h3>`;
    content += `<div class="attribute-list">`;

    // Display scenario attributes
    Object.keys(SCENARIO_ATTRIBUTES).forEach(key => {
        const koreanName = SCENARIO_ATTRIBUTES[key];
        const value = properties[key] !== undefined && properties[key] !== null
            ? properties[key]
            : '-';

        let formattedValue = value;
        if (typeof value === 'number') {
            formattedValue = value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
        }

        content += `<div class="attribute-item">`;
        content += `<span class="attribute-name">${koreanName}</span>`;
        content += `<span class="attribute-value">${formattedValue}</span>`;
        content += `</div>`;
    });

    content += `</div>`;
    content += `</div>`;

    const popupElement = document.createElement('div');
    popupElement.className = 'attribute-popup attribute-popup-visible';
    popupElement.innerHTML = content;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'attribute-popup-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => hideAttributePopup();
    popupElement.appendChild(closeBtn);

    attributePopup = new ol.Overlay({
        element: popupElement,
        positioning: 'bottom-center',
        stopEvent: true,
        offset: [0, -10],
        insertFirst: false
    });

    map.addOverlay(attributePopup);
    attributePopup.setPosition(coordinate);
}

/**
 * Hide attribute popup
 */
function hideAttributePopup() {
    if (attributePopup) {
        const element = attributePopup.getElement();
        if (element) {
            if (attributePopup._hideTimeout) {
                clearTimeout(attributePopup._hideTimeout);
            }
            element.classList.remove('attribute-popup-visible');
            attributePopup._hideTimeout = setTimeout(() => {
                activeMaps.forEach(map => {
                    if (map && attributePopup) {
                        map.removeOverlay(attributePopup);
                    }
                });
                attributePopup = null;
            }, 300);
        } else {
            activeMaps.forEach(map => {
                if (map && attributePopup) {
                    map.removeOverlay(attributePopup);
                }
            });
            attributePopup = null;
        }
    }
    activeMaps.forEach(map => {
        if (map) {
            removeFeatureHighlight(map);
        }
    });
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
    // 0. Register EPSG:5179 projection with proj4js
    // EPSG:5179: Korea 2000 / Central Belt 2010
    proj4.defs('EPSG:5179', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    ol.proj.proj4.register(proj4);

    // 1. Initialize UI with default values
    initializeUI();

    // 2. 2040년 장래인구분포 toggle
    $('#population-2040-toggle').on('change', function() {
        const isChecked = $(this).is(':checked');
        $('#population-2040-label').text(isChecked ? 'On' : 'Off');
        // Update map if already visualized
        if (activeMaps.length > 0) {
            const map = activeMaps[0];
            if (isChecked) {
                addPopulationLayer(map);
            } else {
                // Remove population layer
                const layers = map.getLayers().getArray();
                layers.forEach(layer => {
                    if (layer.get('name') === POPULATION_LAYER) {
                        map.removeLayer(layer);
                    }
                });
            }
        }
    });

    // 3. 지역생활권수 select
    $('#regional-count-select').on('change', function() {
        // Re-visualize if already visualized
        if (activeMaps.length > 0) {
            visualizeSimulation();
        }
    });

    // 4. 공간구조목표 시나리오 buttons
    $('#scenario-m1').on('click', function() {
        // m1 is always selected, do nothing
    });

    $('#scenario-m2').on('click', function() {
        if (selectedScenarios.includes('m2')) {
            selectedScenarios = selectedScenarios.filter(s => s !== 'm2');
        } else {
            selectedScenarios.push('m2');
        }
        updateScenarioButtons();
    });

    $('#scenario-m3').on('click', function() {
        if (selectedScenarios.includes('m3')) {
            selectedScenarios = selectedScenarios.filter(s => s !== 'm3');
        } else {
            selectedScenarios.push('m3');
        }
        updateScenarioButtons();
    });

    // 5. 시뮬레이션 수행 버튼
    $('#simulate-button').on('click', visualizeSimulation);

    // 6. 비교하기 버튼
    $('#compare-button').on('click', toggleCompareMode);

    // 7. Initialize Intent Modal handlers
    $('#intent-modal-btn').on('click', openIntentModal);
    $('#intent-modal-close').on('click', closeIntentModal);

    // Close modal when clicking outside
    $('#intent-modal').on('click', function (e) {
        if (e.target === this) {
            closeIntentModal();
        }
    });
});

