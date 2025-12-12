// Global variables for OpenLayers and state management
let activeMaps = []; // Array to hold all active ol.Map instances
let currentScenarioIndex = 0; // Current scenario index for navigation
let selectedScenarios = []; // Array of selected scenario keys
let isCompareMode = false; // Whether in compare mode (split screen)
let barCharts = {
    average: null,  // Average chart
    minimum: null,  // Minimum chart
    clicked: null   // Clicked feature chart (added dynamically)
};
let averageData = {}; // Store average data for all scenarios
let minimumData = {}; // Store minimum data for all scenarios
let clickedFeatureData = null; // Store clicked feature data

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
    // Remove default zoom controls (줌인/아웃 버튼 제거)
    const defaultControls = ol.control.defaults({
        zoom: false  // 줌 컨트롤 제거
    });

    const newMap = new ol.Map({
        target: targetId,
        layers: [wmsLayer],
        view: view,
        controls: defaultControls
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
async function handleMapClickWithWMS(event, mapInstance, mapId, fullLayerName) {
    // Get layer name from map instance
    const layerName = mapInstance.get('layerName');

    // Don't respond to clicks on current_regional_living_zone
    if (layerName === 'current_regional_living_zone') {
        return;
    }

    const viewResolution = mapInstance.getView().getResolution();
    const wmsLayer = mapInstance.getLayers().getArray().find(layer =>
        layer instanceof ol.layer.Image && layer.getSource() instanceof ol.source.ImageWMS
    );

    if (!wmsLayer) {
        hideAttributePopup();
        // In compare mode, only remove from this map; in single mode, remove from all
        if (isCompareMode) {
            removeFeatureHighlight(mapInstance);
        } else {
            removeFeatureHighlightFromAllMaps();
        }
        return;
    }

    const url = wmsLayer.getSource().getFeatureInfoUrl(
        event.coordinate,
        viewResolution,
        'EPSG:5179',
        {
            'INFO_FORMAT': 'application/json',
            'FEATURE_COUNT': 1,
            'SRS': 'EPSG:5179' // Request geometry in EPSG:5179
        }
    );

    if (url) {
        fetch(url)
            .then(response => response.json())
            .then(async (data) => {
                if (data.features && data.features.length > 0) {
                    const feature = data.features[0];
                    const props = feature.properties;

                    // In compare mode: remove highlights from all maps first, then highlight only this map
                    // In single map mode: just highlight this map
                    if (isCompareMode) {
                        removeFeatureHighlightFromAllMaps();
                    }

                    // Highlight the clicked feature only on this map (no syncing)
                    highlightClickedFeature(mapInstance, feature.geometry, false);

                    // Update charts with clicked feature data (only for scenario layers, not current)
                    const regionName = props.nm || props.name || props.지역명 || props.NAME || '지역';
                    await updateChartsWithClickedFeature(regionName, event.coordinate);
                } else {
                    removeFeatureHighlightFromAllMaps();
                    resetClickedFeatureFromCharts();
                }
            })
            .catch(error => {
                // In compare mode, only remove from this map; in single mode, remove from all
                if (isCompareMode) {
                    removeFeatureHighlight(mapInstance);
                } else {
                    removeFeatureHighlightFromAllMaps();
                }
            });
    } else {
        // In compare mode, only remove from this map; in single mode, remove from all
        if (isCompareMode) {
            removeFeatureHighlight(mapInstance);
        } else {
            removeFeatureHighlightFromAllMaps();
        }
    }
}

// Global variables for feature highlight
// Store highlight overlay for each map (for compare mode)
let highlightOverlays = {}; // { mapId: vectorLayer }

/**
 * Highlight the clicked feature with an overlay
 * @param {ol.Map} map Map instance
 * @param {Object} geometry Feature geometry from GeoJSON
 * @param {boolean} syncToAllMaps (deprecated, kept for compatibility but not used)
 */
function highlightClickedFeature(map, geometry, syncToAllMaps = false) {
    // Remove existing highlight from this map
    removeFeatureHighlight(map);

    if (!geometry) {
        return;
    }

    try {
        // Create a vector layer for highlighting
        const geoJSONFormat = new ol.format.GeoJSON();

        // Check if geometry coordinates look like they're already in EPSG:5179
        // EPSG:5179 coordinates are typically in the range of 900000-1200000 for X and 1500000-2000000 for Y
        // WGS84 coordinates are typically in the range of 120-130 for longitude and 35-40 for latitude
        const sampleCoord = geometry.coordinates;
        let isWGS84 = false;

        if (sampleCoord && sampleCoord.length > 0) {
            const firstCoord = Array.isArray(sampleCoord[0][0]) ? sampleCoord[0][0] : sampleCoord[0];
            if (firstCoord && firstCoord.length >= 2) {
                const lon = firstCoord[0];
                const lat = firstCoord[1];
                // If coordinates are in typical WGS84 range (lon: 120-130, lat: 35-40)
                if (lon >= 100 && lon <= 150 && lat >= 30 && lat <= 45) {
                    isWGS84 = true;
                }
            }
        }

        // Transform geometry based on detected coordinate system
        const features = geoJSONFormat.readFeatures({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: geometry
            }]
        }, {
            dataProjection: isWGS84 ? 'EPSG:4326' : 'EPSG:5179', // Detect coordinate system
            featureProjection: 'EPSG:5179' // Map projection
        });

        if (!features || features.length === 0) {
            return;
        }

        const vectorSource = new ol.source.Vector({
            features: features
        });

        // Create style with only stroke (outline) - no fill
        // Use thicker stroke and brighter color for better visibility
        const highlightStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#89FDFD', // Cyan highlight color for outline
                width: 6, // Increased from 4 to 6 for better visibility
                lineCap: 'round',
                lineJoin: 'round'
            })
            // No fill - only outline
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: highlightStyle,
            zIndex: 10000 // Increased z-index to ensure it's on top
        });

        map.addLayer(vectorLayer);

        // Store highlight overlay for this map
        const mapId = map.getTarget() || 'default';
        highlightOverlays[mapId] = vectorLayer;
    } catch (error) {
        console.error('Error creating highlight:', error);
    }
}

/**
 * Highlight feature on a specific map (internal helper)
 * @param {ol.Map} map Map instance
 * @param {Object} geometry Feature geometry from GeoJSON
 * @param {boolean} storeGeometry Whether to store geometry for syncing
 */
function highlightClickedFeatureOnMap(map, geometry, storeGeometry = false) {
    // Remove existing highlight from this map
    removeFeatureHighlight(map);

    if (!geometry) {
        return;
    }

    try {
        // Create a vector layer for highlighting
        const geoJSONFormat = new ol.format.GeoJSON();

        // Check if geometry coordinates look like they're already in EPSG:5179
        const sampleCoord = geometry.coordinates;
        let isWGS84 = false;

        if (sampleCoord && sampleCoord.length > 0) {
            const firstCoord = Array.isArray(sampleCoord[0][0]) ? sampleCoord[0][0] : sampleCoord[0];
            if (firstCoord && firstCoord.length >= 2) {
                const lon = firstCoord[0];
                const lat = firstCoord[1];
                if (lon >= 100 && lon <= 150 && lat >= 30 && lat <= 45) {
                    isWGS84 = true;
                }
            }
        }

        // Transform geometry based on detected coordinate system
        const features = geoJSONFormat.readFeatures({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: geometry
            }]
        }, {
            dataProjection: isWGS84 ? 'EPSG:4326' : 'EPSG:5179',
            featureProjection: 'EPSG:5179'
        });

        if (!features || features.length === 0) {
            return;
        }

        const vectorSource = new ol.source.Vector({
            features: features
        });

        const highlightStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#89FDFD',
                width: 6,
                lineCap: 'round',
                lineJoin: 'round'
            })
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: highlightStyle,
            zIndex: 10000
        });

        map.addLayer(vectorLayer);

        // Store highlight overlay for this map
        const mapId = map.getTarget() || 'default';
        highlightOverlays[mapId] = vectorLayer;
    } catch (error) {
        console.error('Error creating highlight:', error);
    }
}

/**
 * Remove feature highlight
 * @param {ol.Map} map Map instance
 */
function removeFeatureHighlight(map) {
    const mapId = map.getTarget() || 'default';
    if (highlightOverlays[mapId]) {
        map.removeLayer(highlightOverlays[mapId]);
        delete highlightOverlays[mapId];
    }
}

/**
 * Remove feature highlight from all maps
 */
function removeFeatureHighlightFromAllMaps() {
    activeMaps.forEach(map => {
        removeFeatureHighlight(map);
    });
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
function visualizeSimulation(showLoading = true) {
    // If in compare mode, update compare mode instead
    if (isCompareMode) {
        visualizeCompareMode(showLoading);
        return;
    }

    // Show loading overlay only if explicitly requested (for simulate button click)
    if (showLoading) {
        $('#loading-overlay').removeClass('hidden');
    }

    // FIXME: ##시뮬레이션 수행 시간## (milliseconds)
    // Adjust this value to control the loading duration
    const SIMULATION_DURATION = 1500;

    // Destroy all existing maps and charts
    activeMaps.forEach(map => map.setTarget(null));
    activeMaps = [];

    // Destroy existing charts
    if (barCharts.average) {
        barCharts.average.destroy();
        barCharts.average = null;
    }
    if (barCharts.minimum) {
        barCharts.minimum.destroy();
        barCharts.minimum = null;
    }
    if (barCharts.clicked) {
        barCharts.clicked.destroy();
        barCharts.clicked = null;
    }
    averageData = {};
    minimumData = {};
    clickedFeatureData = null;

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

    // Check if population layer should be shown and update legend visibility
    const showPopulation = $('#population-2040-toggle').is(':checked');
    // Update legend visibility based on toggle state
    if (showPopulation) {
        $('#population-legend').removeClass('hidden');
    } else {
        $('#population-legend').addClass('hidden');
    }

    // Create map HTML with navigation arrows and legend
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
            </div>
        </div>
    `;
    $mapContainer.attr('class', 'h-full');
    $mapContainer.append(mapHtml);

    // Create single map
    const newMap = createSingleMap(mapId, currentLayer, null);
    activeMaps.push(newMap);

    // Add population layer if enabled
    if (showPopulation) {
        addPopulationLayer(newMap);
    }

    // Initialize bar charts in right panel
    const startTime = Date.now();
    setTimeout(async () => {
        newMap.updateSize();
        await fetchAndDisplayChartData();

        // Hide loading overlay after simulation completes
        // Ensure minimum loading duration for better UX
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, SIMULATION_DURATION - elapsedTime);

        setTimeout(() => {
            $('#loading-overlay').addClass('hidden');
        }, remainingTime);
    }, 100);

    // Setup navigation arrows
    if (selectedLayers.length > 1) {
        $('#prev-scenario').on('click', function () {
            if (currentScenarioIndex > 0) {
                currentScenarioIndex--;
                updateMapScenario();
            }
        });

        $('#next-scenario').on('click', function () {
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
async function updateMapScenario() {
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

        // Remove feature highlight when switching maps
        removeFeatureHighlight(map);

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

    // Update bar charts if they exist (preserve clicked feature data)
    if (barCharts.average || barCharts.minimum) {
        // Store clicked feature data before updating
        const clickedAvgDataset = barCharts.average ? barCharts.average.data.datasets.find(ds => ds.borderDash) : null;
        const clickedMinDataset = barCharts.minimum ? barCharts.minimum.data.datasets.find(ds => ds.borderDash) : null;

        await fetchAndDisplayChartData();

        // Restore clicked feature data at the end (rightmost position)
        if (clickedAvgDataset && barCharts.average) {
            barCharts.average.data.datasets.push(clickedAvgDataset);
            barCharts.average.update();
        }
        if (clickedMinDataset && barCharts.minimum) {
            barCharts.minimum.data.datasets.push(clickedMinDataset);
            barCharts.minimum.update();
        }
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
 * Remove population layer from map
 * @param {ol.Map} map Map instance
 */
function removePopulationLayer(map) {
    const layers = map.getLayers().getArray();
    layers.forEach(layer => {
        if (layer.get('name') === POPULATION_LAYER) {
            map.removeLayer(layer);
        }
    });
}

/**
 * Visualize comparison mode (2x2 grid)
 */
function visualizeCompareMode(showLoading = false) {
    // Show loading overlay if requested (when simulate button is clicked)
    if (showLoading) {
        $('#loading-overlay').removeClass('hidden');
    }

    // Destroy all existing maps and charts
    activeMaps.forEach(map => map.setTarget(null));
    activeMaps = [];

    // Destroy existing charts
    if (barCharts.average) {
        barCharts.average.destroy();
        barCharts.average = null;
    }
    if (barCharts.minimum) {
        barCharts.minimum.destroy();
        barCharts.minimum = null;
    }
    if (barCharts.clicked) {
        barCharts.clicked.destroy();
        barCharts.clicked = null;
    }
    averageData = {};
    minimumData = {};
    clickedFeatureData = null;

    // Get selected layers (only activated scenarios from "시뮬레이션 수행" button)
    const selectedLayers = getSelectedLayerNames();

    // If no layers selected, show message and return
    if (selectedLayers.length === 0) {
        alert('비교하기를 사용하려면 먼저 "장래 생활권 시뮬레이션 수행" 버튼을 눌러주세요.');
        $('#compare-toggle').prop('checked', false);
        isCompareMode = false;
        $('#compare-label').text('Off');
        return;
    }

    // Get regional count (k5 or k6)
    const regionalCount = $('#regional-count-select').val();

    // Build map configs with fixed order: m1(좌상), m2(우상), m3(좌하), current(우하)
    // Always use fixed order regardless of selectedScenarios order
    const mapConfigs = [];
    const fixedOrder = ['m1', 'm2', 'm3']; // Fixed order for scenarios

    let mapIndex = 1;

    // Add scenarios in fixed order (m1, m2, m3) if they are selected
    fixedOrder.forEach((scenario, orderIndex) => {
        if (selectedScenarios.includes(scenario) && SCENARIO_LAYERS[scenario] && SCENARIO_LAYERS[scenario][regionalCount]) {
            let position;
            if (orderIndex === 0) {
                position = '좌상'; // m1
            } else if (orderIndex === 1) {
                position = '우상'; // m2
            } else {
                position = '좌하'; // m3
            }

            mapConfigs.push({
                id: `map-compare-${mapIndex}`,
                layerName: SCENARIO_LAYERS[scenario][regionalCount],
                title: SCENARIO_NAMES[scenario],
                position: position
            });
            mapIndex++;
        }
    });

    // Always add current living zone at the end (우하)
    mapConfigs.push({
        id: `map-compare-${mapIndex}`,
        layerName: 'current_regional_living_zone',
        title: '현재 생활권 (지역생활권)',
        position: '우하'
    });

    const $mapContainer = $('#map-container');
    $mapContainer.empty();

    // Determine grid layout based on number of maps
    const totalMaps = mapConfigs.length;
    let gridCols = 2;
    let gridRows = Math.ceil(totalMaps / 2);

    // For 1 map: 2x1 (but we always have at least 2: 1 scenario + current)
    // For 2 maps: 2x1 (1 scenario + current)
    // For 3 maps: 2x2 (2 scenarios + current)
    // For 4 maps: 2x2 (3 scenarios + current)

    if (totalMaps === 2) {
        // 2x1 layout: 1 scenario + current
        $mapContainer.attr('class', 'grid grid-cols-2 gap-1 h-full');
    } else {
        // 2x2 layout: 2 or 3 scenarios + current
        $mapContainer.attr('class', 'grid grid-cols-2 gap-1 h-full');
    }

    // Create shared view for synchronization
    const masterView = new ol.View({
        projection: 'EPSG:5179',
        center: [975000, 1650000],
        zoom: 9
    });

    // Create all 4 maps
    mapConfigs.forEach((config, index) => {
        const mapHtml = `
            <div id="${config.id}-wrapper" class="map-wrapper relative h-full">
                <div id="${config.id}" class="map h-full">
                    <div class="map-title-overlay" title="${config.title}">
                        ${config.title}
                    </div>
                </div>
            </div>
        `;
        $mapContainer.append(mapHtml);

        // Create map with shared view (all maps will be synchronized)
        const newMap = createSingleMap(config.id, config.layerName, masterView);
        activeMaps.push(newMap);
    });

    // Fit view to extent after all maps are created
    setTimeout(() => {
        activeMaps.forEach(map => map.updateSize());

        // Add population layer to all maps if enabled
        const showPopulation = $('#population-2040-toggle').is(':checked');
        if (showPopulation) {
            activeMaps.forEach(map => {
                addPopulationLayer(map);
            });
        }

        // Fit to first map's extent (first activated scenario)
        const firstLayerName = `${GEOSERVER_WORKSPACE}:${mapConfigs[0].layerName}`;
        getLayerExtentFromCapabilities(firstLayerName).then(extent => {
            if (extent) {
                masterView.fit(extent, { padding: [50, 50, 50, 50], duration: 500 });
            } else {
                const defaultExtent = [900000, 1550000, 1050000, 1750000];
                masterView.fit(defaultExtent, { padding: [50, 50, 50, 50], duration: 500 });
            }
        });

        // Initialize bar charts in compare mode
        const startTime = Date.now();
        setTimeout(async () => {
            await fetchAndDisplayChartData();

            // Hide loading overlay if it was shown
            if (showLoading) {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, 1500 - elapsedTime);
                setTimeout(() => {
                    $('#loading-overlay').addClass('hidden');
                }, remainingTime);
            }
        }, 100);
    }, 100);
}

/**
 * Toggle compare mode (2x2 grid or single map)
 */
function toggleCompareMode() {
    isCompareMode = !isCompareMode;
    const isChecked = isCompareMode;
    $('#compare-label').text(isChecked ? 'On' : 'Off');

    if (isCompareMode) {
        // 2x2 comparison mode
        // Show chart panel in compare mode (charts should work)
        $('#chart-panel').removeClass('hidden');
        visualizeCompareMode();
    } else {
        // Single map mode - return to m1 scenario
        // Show chart panel in single map mode
        $('#chart-panel').removeClass('hidden');
        // Don't show loading overlay when toggling off compare mode
        visualizeSimulation(false);
    }
}

// --- CHART.JS FUNCTIONS ---

/**
 * Fetch all feature data and calculate average/minimum, then display charts
 */
async function fetchAndDisplayChartData() {
    const attributeKeys = ['c_pop40_ratio', '1h_nc_ratio', '1h_over_pop_ratio'];
    const attributeNames = ['중심지 인구 집중도', '중심지 주변 연결성', '중심지 접근의 형평성'];
    const regionalCount = $('#regional-count-select').val();

    // Labels: only 3 attributes (no scenario names)
    const labels = attributeNames;

    // Initialize charts if not already initialized
    if (!barCharts.average) {
        initBarChart('average', 'barChart-average', labels);
    } else {
        barCharts.average.data.labels = labels;
    }

    if (!barCharts.minimum) {
        initBarChart('minimum', 'barChart-minimum', labels);
    } else {
        barCharts.minimum.data.labels = labels;
    }

    // Fetch data for all selected scenarios
    averageData = {};
    minimumData = {};

    for (const scenario of selectedScenarios) {
        const layerName = SCENARIO_LAYERS[scenario][regionalCount];
        if (!layerName) continue;

        const fullLayerName = `${GEOSERVER_WORKSPACE}:${layerName}`;

        try {
            // Use WFS to get all features
            const wfsUrl = `${GEOSERVER_URL}/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=${fullLayerName}&outputFormat=application/json&srsName=EPSG:5179`;
            const response = await fetch(wfsUrl);
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const scenarioName = SCENARIO_NAMES[scenario] || scenario;

                // Calculate average and minimum for each attribute
                const attributeSums = {};
                const attributeMins = {};
                const attributeCounts = {};

                attributeKeys.forEach(key => {
                    attributeSums[key] = 0;
                    attributeMins[key] = Infinity;
                    attributeCounts[key] = 0;
                });

                data.features.forEach(feature => {
                    attributeKeys.forEach(key => {
                        const value = feature.properties[key];
                        if (value !== undefined && value !== null && !isNaN(value)) {
                            const numValue = parseFloat(value);
                            attributeSums[key] += numValue;
                            attributeCounts[key]++;
                            if (numValue < attributeMins[key]) {
                                attributeMins[key] = numValue;
                            }
                        }
                    });
                });

                // Calculate averages (for each attribute)
                const avgValues = attributeKeys.map(key => {
                    return attributeCounts[key] > 0 ? attributeSums[key] / attributeCounts[key] : 0;
                });

                const minValues = attributeKeys.map(key => {
                    return attributeMins[key] !== Infinity ? attributeMins[key] : 0;
                });

                // Store as object with attribute keys for easier access
                averageData[scenario] = {};
                minimumData[scenario] = {};
                attributeKeys.forEach((key, idx) => {
                    averageData[scenario][key] = avgValues[idx];
                    minimumData[scenario][key] = minValues[idx];
                });
            }
        } catch (error) {
            // Silent error handling
        }
    }

    // Update charts with calculated data
    updateAverageChart(labels);
    updateMinimumChart(labels);
}

/**
 * Initialize a bar chart
 * @param {string} chartKey Chart key ('average' or 'minimum')
 * @param {string} canvasId Canvas element ID
 * @param {Array} labels Chart labels
 */
function initBarChart(chartKey, canvasId, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');

    barCharts[chartKey] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function (value) {
                            return value + '%';
                        }
                    }
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
}

/**
 * Update average chart with calculated data
 * @param {Array} labels Chart labels (3 attributes)
 */
function updateAverageChart(labels) {
    if (!barCharts.average) return;

    const attributeKeys = ['c_pop40_ratio', '1h_nc_ratio', '1h_over_pop_ratio'];
    const scenarioColors = {
        'm1': { bg: 'rgba(59, 130, 246, 0.6)', border: 'rgb(59, 130, 246)' },
        'm2': { bg: 'rgba(239, 68, 68, 0.6)', border: 'rgb(239, 68, 68)' },
        'm3': { bg: 'rgba(34, 197, 94, 0.6)', border: 'rgb(34, 197, 94)' }
    };

    // Store clicked feature dataset before clearing
    const clickedAvgDataset = barCharts.average.data.datasets.find(ds => ds.borderDash);

    // Clear existing datasets (remove all, will add back clicked feature at the end)
    barCharts.average.data.datasets = [];

    // Add datasets for selected scenarios (max 3)
    selectedScenarios.forEach(scenario => {
        if (!averageData[scenario]) return;

        const scenarioName = SCENARIO_NAMES[scenario] || scenario;
        const colors = scenarioColors[scenario] || { bg: 'rgba(156, 163, 175, 0.6)', border: 'rgb(156, 163, 175)' };

        // Create dataset with data for 3 attributes
        const datasetData = attributeKeys.map(key => {
            return averageData[scenario][key] || 0;
        });

        barCharts.average.data.datasets.push({
            label: scenarioName,
            data: datasetData,
            backgroundColor: colors.bg,
            borderColor: colors.border,
            borderWidth: 1
        });
    });

    // Add clicked feature dataset at the end (rightmost position)
    if (clickedAvgDataset) {
        barCharts.average.data.datasets.push(clickedAvgDataset);
    }

    barCharts.average.update();
}

/**
 * Update minimum chart with calculated data
 * @param {Array} labels Chart labels (3 attributes)
 */
function updateMinimumChart(labels) {
    if (!barCharts.minimum) return;

    const attributeKeys = ['c_pop40_ratio', '1h_nc_ratio', '1h_over_pop_ratio'];
    const scenarioColors = {
        'm1': { bg: 'rgba(59, 130, 246, 0.6)', border: 'rgb(59, 130, 246)' },
        'm2': { bg: 'rgba(239, 68, 68, 0.6)', border: 'rgb(239, 68, 68)' },
        'm3': { bg: 'rgba(34, 197, 94, 0.6)', border: 'rgb(34, 197, 94)' }
    };

    // Store clicked feature dataset before clearing
    const clickedMinDataset = barCharts.minimum.data.datasets.find(ds => ds.borderDash);

    // Clear existing datasets (remove all, will add back clicked feature at the end)
    barCharts.minimum.data.datasets = [];

    // Add datasets for selected scenarios (max 3)
    selectedScenarios.forEach(scenario => {
        if (!minimumData[scenario]) return;

        const scenarioName = SCENARIO_NAMES[scenario] || scenario;
        const colors = scenarioColors[scenario] || { bg: 'rgba(156, 163, 175, 0.6)', border: 'rgb(156, 163, 175)' };

        // Create dataset with data for 3 attributes
        const datasetData = attributeKeys.map(key => {
            return minimumData[scenario][key] || 0;
        });

        barCharts.minimum.data.datasets.push({
            label: scenarioName,
            data: datasetData,
            backgroundColor: colors.bg,
            borderColor: colors.border,
            borderWidth: 1
        });
    });

    // Add clicked feature dataset at the end (rightmost position)
    if (clickedMinDataset) {
        barCharts.minimum.data.datasets.push(clickedMinDataset);
    }

    barCharts.minimum.update();
}

/**
 * Update charts with clicked feature data
 * @param {string} regionName
 * @param {ol.Coordinate} coordinate Clicked coordinate
 */
async function updateChartsWithClickedFeature(regionName, coordinate) {
    const attributeKeys = ['c_pop40_ratio', '1h_nc_ratio', '1h_over_pop_ratio'];
    const regionalCount = $('#regional-count-select').val();

    // Get map instance
    const map = activeMaps[0];
    if (!map) {
        return;
    }

    const viewResolution = map.getView().getResolution();
    clickedFeatureData = {};

    // Fetch data from all selected scenario layers
    for (const scenario of selectedScenarios) {
        const layerName = SCENARIO_LAYERS[scenario][regionalCount];
        if (!layerName) continue;

        const fullLayerName = `${GEOSERVER_WORKSPACE}:${layerName}`;

        // Create temporary WMS source to get feature info
        const tempWmsSource = new ol.source.ImageWMS({
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

        try {
            const featureInfoUrl = tempWmsSource.getFeatureInfoUrl(
                coordinate,
                viewResolution,
                'EPSG:5179',
                {
                    'INFO_FORMAT': 'application/json',
                    'FEATURE_COUNT': 1
                }
            );

            if (featureInfoUrl) {
                const response = await fetch(featureInfoUrl);
                const data = await response.json();

                if (data.features && data.features.length > 0) {
                    const props = data.features[0].properties;
                    const scenarioName = SCENARIO_NAMES[scenario] || scenario;

                    // Extract attribute values for this scenario
                    clickedFeatureData[scenario] = {};
                    attributeKeys.forEach(attrKey => {
                        clickedFeatureData[scenario][attrKey] = props[attrKey] !== undefined && props[attrKey] !== null
                            ? parseFloat(props[attrKey])
                            : 0;
                    });
                }
            }
        } catch (error) {
            // Silent error handling
        }
    }

    // Add clicked feature data to both charts
    addClickedFeatureToCharts(regionName);
}

/**
 * Add clicked feature data to average and minimum charts
 * @param {string} regionName
 */
function addClickedFeatureToCharts(regionName) {
    const attributeKeys = ['c_pop40_ratio', '1h_nc_ratio', '1h_over_pop_ratio'];

    // Calculate average of all selected scenarios for clicked feature
    let clickedAvgData = [0, 0, 0];
    let clickedMinData = [Infinity, Infinity, Infinity];
    let hasData = false;

    selectedScenarios.forEach(scenario => {
        if (!clickedFeatureData[scenario]) return;
        hasData = true;

        attributeKeys.forEach((key, idx) => {
            const value = clickedFeatureData[scenario][key] || 0;
            clickedAvgData[idx] += value;
            if (value < clickedMinData[idx]) {
                clickedMinData[idx] = value;
            }
        });
    });

    if (!hasData) return;

    // Calculate average
    const scenarioCount = selectedScenarios.filter(s => clickedFeatureData[s]).length;
    if (scenarioCount > 0) {
        clickedAvgData = clickedAvgData.map(val => val / scenarioCount);
    }

    // Handle Infinity values
    clickedMinData = clickedMinData.map(val => val === Infinity ? 0 : val);

    // Add to average chart
    if (barCharts.average) {
        // Remove existing clicked dataset
        barCharts.average.data.datasets = barCharts.average.data.datasets.filter(
            ds => !ds.borderDash
        );

        barCharts.average.data.datasets.push({
            label: regionName,
            data: clickedAvgData,
            backgroundColor: 'rgba(255, 193, 7, 0.6)', // Yellow/Orange
            borderColor: 'rgb(255, 152, 0)',
            borderWidth: 2,
            borderDash: [5, 5]
        });
        barCharts.average.update();
    }

    // Add to minimum chart
    if (barCharts.minimum) {
        // Remove existing clicked dataset
        barCharts.minimum.data.datasets = barCharts.minimum.data.datasets.filter(
            ds => !ds.borderDash
        );

        barCharts.minimum.data.datasets.push({
            label: regionName,
            data: clickedMinData,
            backgroundColor: 'rgba(255, 193, 7, 0.6)', // Yellow/Orange
            borderColor: 'rgb(255, 152, 0)',
            borderWidth: 2,
            borderDash: [5, 5]
        });
        barCharts.minimum.update();
    }
}

/**
 * Reset clicked feature data from charts
 */
function resetClickedFeatureFromCharts() {
    clickedFeatureData = null;

    if (barCharts.average) {
        // Remove all datasets that contain clicked feature (identified by borderDash)
        barCharts.average.data.datasets = barCharts.average.data.datasets.filter(
            ds => !ds.borderDash
        );
        barCharts.average.update();
    }

    if (barCharts.minimum) {
        // Remove all datasets that contain clicked feature (identified by borderDash)
        barCharts.minimum.data.datasets = barCharts.minimum.data.datasets.filter(
            ds => !ds.borderDash
        );
        barCharts.minimum.update();
    }
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
 * Intent modal functions are now handled by intent-modal.js
 * These functions are kept for backward compatibility but are no longer used
 */

// --- INITIALIZATION ---
$(document).ready(function () {
    // 0. Register EPSG:5179 projection with proj4js
    // EPSG:5179: Korea 2000 / Central Belt 2010
    proj4.defs('EPSG:5179', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
    ol.proj.proj4.register(proj4);

    // 1. Initialize UI with default values
    initializeUI();

    // 2. Auto-visualize on page load (default: m1, k5, population off)
    setTimeout(() => {
        visualizeSimulation();
    }, 500);

    // 3. 2040년 장래인구분포 toggle
    $('#population-2040-toggle').on('change', function () {
        const isChecked = $(this).is(':checked');
        $('#population-2040-label').text(isChecked ? 'On' : 'Off');
        // Update all maps if already visualized (support both single and compare mode)
        if (activeMaps.length > 0) {
            activeMaps.forEach(map => {
                if (isChecked) {
                    addPopulationLayer(map);
                } else {
                    removePopulationLayer(map);
                }
            });
            // Update legend visibility based on toggle state
            if (isChecked) {
                $('#population-legend').removeClass('hidden');
            } else {
                $('#population-legend').addClass('hidden');
            }
        }
    });

    // 4. 지역생활권수 select
    // Note: Map visualization only happens when "장래 생활권 시뮬레이션 수행" button is clicked
    // No action needed on change event

    // 5. 공간구조목표 시나리오 buttons
    $('#scenario-m1').on('click', function () {
        // m1 is always selected, do nothing
    });

    $('#scenario-m2').on('click', function () {
        if (selectedScenarios.includes('m2')) {
            selectedScenarios = selectedScenarios.filter(s => s !== 'm2');
        } else {
            selectedScenarios.push('m2');
        }
        updateScenarioButtons();
    });

    $('#scenario-m3').on('click', function () {
        if (selectedScenarios.includes('m3')) {
            selectedScenarios = selectedScenarios.filter(s => s !== 'm3');
        } else {
            selectedScenarios.push('m3');
        }
        updateScenarioButtons();
    });

    // 6. 시뮬레이션 수행 버튼
    $('#simulate-button').on('click', visualizeSimulation);

    // 7. 비교하기 토글
    $('#compare-toggle').on('change', function () {
        toggleCompareMode();
    });

    // 8. Intent Modal is now handled by intent-modal.js (loaded before this file)
});

