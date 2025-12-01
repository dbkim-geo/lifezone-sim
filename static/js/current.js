// Global variables for OpenLayers and state management
let activeMaps = []; // Array to hold all active ol.Map instances
let vectorSource; // Reusable source for all vector layers
let currentLevel = 'basic'; // 'basic' for 기초생활권, 'regional' for 지역생활권
let radarCharts = {}; // Object to hold radar charts for each map (key: mapId, value: Chart instance)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Firestore placeholder
let currentIndicatorIndex = 0; // Current indicator index for navigation
let selectedIndicators = []; // Array of selected indicator keys

// GeoServer configuration (loaded from config.js)
// Development: http://localhost:8088/geoserver
// Production: http://14.5.12.41:8088/geoserver
const GEOSERVER_URL = typeof window !== 'undefined' && window.GEOSERVER_URL
    ? window.GEOSERVER_URL
    : 'http://localhost:8088/geoserver';
const GEOSERVER_WORKSPACE = typeof window !== 'undefined' && window.GEOSERVER_WORKSPACE
    ? window.GEOSERVER_WORKSPACE
    : 'lifesim';
const LAYER_NAMES = {
    basic: 'current_basic_living_zone',
    regional: 'current_regional_living_zone'
};

// Unit mapping: { columnName: unit }
const UNIT_MAPPING = {
    basic: {
        // 기본현황
        'z_area_km2': 'km²',
        'c_area_km2': 'km²',
        'ts_ppop_23': '명',
        'C_ts_pgrid_cnt_23': '개',
        'C_ts_ppop_23': '명',
        'ts_z_pop_den_23': '명/km²',
        'ts_c_pop_den_23': '명/km²',
        'hospitals_cnt_23': '개',
        'foodstore_cnt_22': '개',
        'ele_schools_cnt_23': '개',
        'nursery_cnt_23': '개',
        'eldercare_cnt_24': '개',
        'all_fac_cnt_23': '개',
        'emr_fac_z_cnt_23': '개',
        'unv_fac_z_cnt_23': '개',
        'cul_fac_z_cnt_23': '개',
        'lib_fac_z_cnt_23': '개',
        'wel_fac_z_cnt_23': '개',
        'agr_fac_z_cnt_23': '개',
        'all_hg_fac_cnt_23': '개',
        // 콤팩트성
        'cp_c_pratio_23': '%',
        'cp_fac_agg_23': '',
        'cp_ngh_fac_dist_cor_avg_23': 'km',
        'cp_ngh_fac_c_sat_ratio_23': '%',
        // 네트워크성
        'nt_uc_road_mins_22': '분',
        'nt_uc_pub_trans_mins_23': '분',
        'nt_rd_acc_1hr_center_cnt_22': '개',
        'nt_pt_acc_1hr_center_cnt_23': '개',
        'nt_rd_acc_30m_pgrid_ratio_23': '%',
        'nt_pt_within_30m_rgrid_ratio_23': '%',
        // 생활편리성
        'lv_rd_acc_over_30m_pop_ratio_23': '%',
        'lv_pt_acc_over_30m_pop_ratio_23': '%',
        'lv_fd_medic_BCcard_ratio_23': '%',
        'lv_uc_add_fac_type_cnt_23': '개'
    },
    regional: {
        // 기본현황
        'area_km2': 'km²',
        'all_C_area_km2': 'km²',
        'ts_pop_23': '명',
        'ts_c_pop_23': '명',
        'ts_pop_den_23': '명/km²',
        'ts_c_pop_den_23': '명/km²',
        // 콤팩트성
        'c_pop_ratio_23': '%',
        'hg_fac_agg_23': '',
        'hg_fac_avg_pw_dist_km_23': 'km',
        'hg_fac_sat_ratio_23': '%',
        // 네트워크성
        'daegu_rd_time_mins_25': '분',
        'daegu_pt_rd_time_mins_25': '분',
        'c_90m_rd_acc_cnt_23': '개',
        'c_90m_pt_acc_cnt_23': '개',
        'nc_60m_rd_acc_ratio_23': '%',
        'nc_60m_pt_acc_ratio_23': '%',
        // 생활편리성
        'within_food_med_trip_ratio_23': '%',
        'r90m_rd_add_hg_fac_type_cnt_23': '개',
        'r90m_pt_add_hg_fac_type_cnt_23': '개',
        'rd_over_1h_pop_ratio_23': '%',
        'pt_over_1h_pop_ratio_23': '%'
    }
};

// Reverse indicators (higher value is worse - need inverse normalization)
const REVERSE_INDICATORS = {
    basic: [
        'cp_ngh_fac_dist_cor_avg_23', // 서비스 근접성 (거리이므로 역방향)
        'nt_uc_road_mins_22', // 상위 중심지 연결성(도로이동) (시간이므로 역방향)
        'nt_uc_pub_trans_mins_23', // 상위 중심지 연결성(대중교통) (시간이므로 역방향)
        'lv_rd_acc_over_30m_pop_ratio_23', // 중심지 접근 형평성(도로이동) (30분 초과 비율이므로 역방향)
        'lv_pt_acc_over_30m_pop_ratio_23' // 중심지 접근 형평성(대중교통) (30분 초과 비율이므로 역방향)
    ],
    regional: [
        'hg_fac_avg_pw_dist_km_23', // 고차서비스시설 평균 거리 (거리이므로 역방향)
        'daegu_rd_time_mins_25', // 대구 연결성(도로이동) (시간이므로 역방향)
        'daegu_pt_rd_time_mins_25', // 대구 연결성(대중교통) (시간이므로 역방향)
        'rd_over_1h_pop_ratio_23', // 1시간 초과 도로 접근 인구 비율 (역방향)
        'pt_over_1h_pop_ratio_23' // 1시간 초과 대중교통 접근 인구 비율 (역방향)
    ]
};

// Column mapping: { columnName: koreanName }
const COLUMN_MAPPING = {
    basic: {
        // 기본현황 (20개)
        'z_area_km2': '기초생활권 면적',
        'c_area_km2': '생활중심지 면적',
        'ts_ppop_23': '총 인구 수',
        'C_ts_pgrid_cnt_23': '생활중심지 내 거주격자 수',
        'C_ts_ppop_23': '생활중심지 인구 수',
        'ts_z_pop_den_23': '인구밀도',
        'ts_c_pop_den_23': '생활중심지 인구밀도',
        'hospitals_cnt_23': '병의원 수',
        'foodstore_cnt_22': '슈퍼마켓, 편의점 수',
        'ele_schools_cnt_23': '초등학교 수',
        'nursery_cnt_23': '어린이집 수',
        'eldercare_cnt_24': '재가장기요양기관 수',
        'all_fac_cnt_23': '근린시설 총 개수',
        'emr_fac_z_cnt_23': '응급의료시설 수',
        'unv_fac_z_cnt_23': '고등교육기관 수',
        'cul_fac_z_cnt_23': '문화공연시설 수',
        'lib_fac_z_cnt_23': '국공립도서관 수',
        'wel_fac_z_cnt_23': '복지관 수',
        'agr_fac_z_cnt_23': '농기계임대센터 수',
        'all_hg_fac_cnt_23': '고차서비스시설 총 개수',
        // 콤팩트성 (4개)
        'cp_c_pratio_23': '중심지 인구 집중도',
        'cp_fac_agg_23': '서비스 복합 집적도',
        'cp_ngh_fac_dist_cor_avg_23': '서비스 근접성',
        'cp_ngh_fac_c_sat_ratio_23': '서비스 충족도',
        // 네트워크성 (6개)
        'nt_uc_road_mins_22': '상위 중심지 연결성(도로이동)',
        'nt_uc_pub_trans_mins_23': '상위 중심지 연결성(대중교통)',
        'nt_rd_acc_1hr_center_cnt_22': '동급 중심지 간 연결성(도로이동)',
        'nt_pt_acc_1hr_center_cnt_23': '동급 중심지 간 연결성(대중교통)',
        'nt_rd_acc_30m_pgrid_ratio_23': '중심지-주변 연결성(도로이동)',
        'nt_pt_within_30m_rgrid_ratio_23': '중심지-주변 연결성(대중교통)',
        // 생활편리성 (4개)
        'lv_rd_acc_over_30m_pop_ratio_23': '중심지 접근 형평성(도로이동)',
        'lv_pt_acc_over_30m_pop_ratio_23': '중심지 접근 형평성(대중교통)',
        'lv_fd_medic_BCcard_ratio_23': '서비스 이용 자족성',
        'lv_uc_add_fac_type_cnt_23': '중심지 간 기능보완성'
    },
    regional: {
        // 기본현황 (6개)
        'area_km2': '지역생활권 면적',
        'all_C_area_km2': '생활+지역중심지 면적',
        'ts_pop_23': '총 인구 수',
        'ts_c_pop_23': '생활+지역중심지 인구 수',
        'ts_pop_den_23': '인구밀도',
        'ts_c_pop_den_23': '생활+지역중심지 인구밀도',
        // 콤팩트성 (4개)
        'c_pop_ratio_23': '중심지 인구 집중도',
        'hg_fac_agg_23': '서비스 복합 집적도',
        'hg_fac_avg_pw_dist_km_23': '서비스 근접성',
        'hg_fac_sat_ratio_23': '서비스 충족도',
        // 네트워크성 (6개)
        'daegu_rd_time_mins_25': '상위중심지 연결성(도로이동)',
        'daegu_pt_rd_time_mins_25': '상위중심지 연결성(대중교통)',
        'c_90m_rd_acc_cnt_23': '동급 중심지 간 연결성(도로이동)',
        'c_90m_pt_acc_cnt_23': '동급 중심지 간 연결성(대중교통)',
        'nc_60m_rd_acc_ratio_23': '중심지-주변 연결성(도로이동)',
        'nc_60m_pt_acc_ratio_23': '중심지-주변 연결성(대중교통)',
        // 생활편리성 (5개)
        'within_food_med_trip_ratio_23': '서비스 이용 자족성',
        'r90m_rd_add_hg_fac_type_cnt_23': '중심지 간 기능 보완성(도로이동)',
        'r90m_pt_add_hg_fac_type_cnt_23': '중심지 간 기능 보완성(대중교통)',
        'rd_over_1h_pop_ratio_23': '중심지 접근 형평성(도로이동)',
        'pt_over_1h_pop_ratio_23': '중심지 접근 형평성(대중교통)'
    }
};

// --- MOCK DATA STRUCTURES ---
// Helper to generate numbered indicators
const genIndicators = (baseName, count, start = 1) =>
    Array.from({ length: count }, (_, i) => `${baseName}${start + i}`);

// Build MOCK_DATA from COLUMN_MAPPING
const MOCK_DATA = {
    basic: {
        levelName: "기초생활권",
        categories: {
            "기본현황": [
                'z_area_km2', 'c_area_km2', 'ts_ppop_23', 'C_ts_pgrid_cnt_23', 'C_ts_ppop_23',
                'ts_z_pop_den_23', 'ts_c_pop_den_23', 'hospitals_cnt_23', 'foodstore_cnt_22',
                'ele_schools_cnt_23', 'nursery_cnt_23', 'eldercare_cnt_24', 'all_fac_cnt_23',
                'emr_fac_z_cnt_23', 'unv_fac_z_cnt_23', 'cul_fac_z_cnt_23', 'lib_fac_z_cnt_23',
                'wel_fac_z_cnt_23', 'agr_fac_z_cnt_23', 'all_hg_fac_cnt_23'
            ],
            "콤팩트성": [
                'cp_c_pratio_23', 'cp_fac_agg_23', 'cp_ngh_fac_dist_cor_avg_23', 'cp_ngh_fac_c_sat_ratio_23'
            ],
            "네트워크성": [
                'nt_uc_road_mins_22', 'nt_uc_pub_trans_mins_23', 'nt_rd_acc_1hr_center_cnt_22',
                'nt_pt_acc_1hr_center_cnt_23', 'nt_rd_acc_30m_pgrid_ratio_23', 'nt_pt_within_30m_rgrid_ratio_23'
            ],
            "생활편리성": [
                'lv_rd_acc_over_30m_pop_ratio_23', 'lv_pt_acc_over_30m_pop_ratio_23',
                'lv_fd_medic_BCcard_ratio_23', 'lv_uc_add_fac_type_cnt_23'
            ]
        },
        indicatorSchema: {
            "기본현황": 20, "콤팩트성": 4, "네트워크성": 6, "생활편리성": 4
        }
    },
    regional: {
        levelName: "지역생활권",
        categories: {
            "기본현황": [
                'area_km2', 'all_C_area_km2', 'ts_pop_23', 'ts_c_pop_23', 'ts_pop_den_23', 'ts_c_pop_den_23'
            ],
            "콤팩트성": [
                'c_pop_ratio_23', 'hg_fac_agg_23', 'hg_fac_avg_pw_dist_km_23', 'hg_fac_sat_ratio_23'
            ],
            "네트워크성": [
                'daegu_rd_time_mins_25', 'daegu_pt_rd_time_mins_25', 'c_90m_rd_acc_cnt_23',
                'c_90m_pt_acc_cnt_23', 'nc_60m_rd_acc_ratio_23', 'nc_60m_pt_acc_ratio_23'
            ],
            "생활편리성": [
                'within_food_med_trip_ratio_23', 'r90m_rd_add_hg_fac_type_cnt_23', 'r90m_pt_add_hg_fac_type_cnt_23',
                'rd_over_1h_pop_ratio_23', 'pt_over_1h_pop_ratio_23'
            ]
        },
        indicatorSchema: {
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

// Function to get only diagnostic indicators (excluding 기본현황)
function getDiagnosticIndicators() {
    const data = MOCK_DATA[currentLevel];
    let diagnosticIndicators = [];
    // Only include 콤팩트성, 네트워크성, 생활편리성
    const diagnosticCategories = ['콤팩트성', '네트워크성', '생활편리성'];
    for (const category of diagnosticCategories) {
        if (data.categories[category]) {
            diagnosticIndicators = diagnosticIndicators.concat(data.categories[category]);
        }
    }
    return diagnosticIndicators;
}


// Mock GeoJSON data (simple square features for demonstration)
// Note: This is not used anymore with WMS, but kept for compatibility
const mockGeoJson = {
    'type': 'FeatureCollection',
    'crs': { 'type': 'name', 'properties': { 'name': 'EPSG:5179' } },
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
 * Now uses WMS layer instead of mock GeoJSON.
 */
function initVectorSource() {
    // Vector source is now created per map with WMS layer
    // This function is kept for compatibility but may not be needed
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
 * For WMS layers, styling is handled server-side via SLD.
 * This function is kept for potential vector layer styling.
 * @param {string} indicatorKey The property name (indicator) to visualize.
 * @returns {ol.style.StyleFunction}
 */
function createIndicatorStyleFunction(indicatorKey) {
    return function (feature) {
        // For WMS, this may not be used, but kept for compatibility
        let keyToUse = indicatorKey;
        if (feature && !feature.get(indicatorKey)) {
            keyToUse = Object.keys(feature.getProperties()).find(k => k.startsWith(indicatorKey.split(' ')[0])) || indicatorKey;
        }

        const value = feature ? (feature.get(keyToUse) || Math.floor(Math.random() * 100)) : 50;
        const color = getColor(value);

        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.7)',
                width: 1.5
            }),
            fill: new ol.style.Fill({
                color: color + 'CC'
            }),
            text: new ol.style.Text({
                text: feature ? (feature.get('지역명') || '') : '',
                font: '14px Noto Sans',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 3 })
            })
        });
    };
}

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

        // Find the layer in capabilities
        // Try both nested Layer structure and direct Layer with Name
        let layers = xml.querySelectorAll('Layer > Layer');
        if (layers.length === 0) {
            // Try alternative structure
            layers = xml.querySelectorAll('Layer');
        }

        for (const layer of layers) {
            const nameElement = layer.querySelector('Name');
            const layerNameText = nameElement ? nameElement.textContent.trim() : '';

            // Try exact match first
            if (layerNameText === layerName) {
                // Find EPSG:5179 bounding box
                const bboxElements = layer.querySelectorAll('BoundingBox');
                for (const bbox of bboxElements) {
                    const srs = bbox.getAttribute('SRS') || bbox.getAttribute('CRS');
                    if (srs === 'EPSG:5179') {
                        const minX = parseFloat(bbox.getAttribute('minx'));
                        const minY = parseFloat(bbox.getAttribute('miny'));
                        const maxX = parseFloat(bbox.getAttribute('maxx'));
                        const maxY = parseFloat(bbox.getAttribute('maxy'));
                        return [minX, minY, maxX, maxY];
                    }
                }
                // If no EPSG:5179 found, use the first bbox
                const firstBbox = layer.querySelector('BoundingBox');
                if (firstBbox) {
                    const minX = parseFloat(firstBbox.getAttribute('minx'));
                    const minY = parseFloat(firstBbox.getAttribute('miny'));
                    const maxX = parseFloat(firstBbox.getAttribute('maxx'));
                    const maxY = parseFloat(firstBbox.getAttribute('maxy'));
                    return [minX, minY, maxX, maxY];
                }
            }

            // Try partial match (in case workspace prefix is different)
            if (layerNameText && layerNameText.endsWith(':' + layerName.split(':')[1])) {
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
        console.warn('Layer extent not found in GetCapabilities, using default');
        return null;
    } catch (error) {
        console.error('Error fetching layer extent:', error);
        return null;
    }
}

/**
 * Create and initialize a single OpenLayers map with GeoServer WMS layer.
 * @param {string} targetId The ID of the div element to render the map into.
 * @param {string} indicatorKey The indicator to visualize on this map.
 * @param {ol.View | null} masterView The view to link to for synchronization. If null, a new view is created.
 * @returns {ol.Map} The created map instance.
 */
function createSingleMap(targetId, indicatorKey, masterView = null) {
    // 1. Get layer name based on current level
    const layerName = LAYER_NAMES[currentLevel];
    const fullLayerName = `${GEOSERVER_WORKSPACE}:${layerName}`;

    // 2. Use indicatorKey as styleName, add 'reg_' prefix for regional level
    // GeoServer will use the style if it exists, otherwise use default style
    const styleName = currentLevel === 'regional' ? `reg_${indicatorKey}` : indicatorKey;

    // 3. Create WMS Image Layer with EPSG:5179
    // Note: WMS 1.1.0 uses SRS, WMS 1.3.0 uses CRS
    // Always pass STYLES parameter - GeoServer will use default style if style doesn't exist
    const wmsParams = {
        'LAYERS': fullLayerName,
        'TILED': false, // Changed to false for debugging
        'VERSION': '1.1.0',
        'FORMAT': 'image/png',
        'TRANSPARENT': true,
        'SRS': 'EPSG:5179', // WMS 1.1.0 uses SRS
        'STYLES': styleName // Always pass styleName, GeoServer will use default if style doesn't exist
    };

    const wmsSource = new ol.source.ImageWMS({
        url: `${GEOSERVER_URL}/wms`,
        params: wmsParams,
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
    });

    const wmsLayer = new ol.layer.Image({
        source: wmsSource,
        zIndex: 1,
        opacity: 1.0 // Make sure it's not transparent
    });


    // 3. Determine View: Use masterView if provided, otherwise create a new one.
    const view = masterView || new ol.View({
        projection: 'EPSG:5179',
        center: [975000, 1650000], // Default center, will be updated with actual extent
        zoom: 9
    });

    // 4. Create Map Instance
    // Note: OSM base layer uses EPSG:3857, but OpenLayers will handle projection automatically
    const newMap = new ol.Map({
        target: targetId,
        layers: [
            // Remove OSM base layer for now to avoid projection issues
            // new ol.layer.Tile({ source: new ol.source.OSM(), zIndex: 0 }),
            wmsLayer
        ],
        view: view
    });

    // Add error handling and logging for WMS layer (after map is created)
    wmsLayer.getSource().on('imageloaderror', function (event) {
        console.error('WMS Image Load Error:', event);
        const source = wmsLayer.getSource();
        // Get the actual WMS GetMap URL
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
            console.error('Failed WMS GetMap URL:', url);
            console.error('Extent:', extent);
            console.error('Resolution:', resolution);
            console.error('Params:', params);
        } catch (err) {
            console.error('Error constructing WMS URL:', err);
        }
    });

    // 5. Attach click handler for feature info (using GetFeatureInfo)
    // Store indicatorKey in map for later use
    newMap.set('indicatorKey', indicatorKey);

    newMap.on('singleclick', function (evt) {
        handleMapClickWithWMS(evt, newMap, targetId, fullLayerName, indicatorKey);
    });

    // 6. Fetch actual extent from GetCapabilities and fit view
    if (!masterView) {
        getLayerExtentFromCapabilities(fullLayerName).then(extent => {
            if (extent) {
                newMap.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500 });
            } else {
                // Fallback to default extent if GetCapabilities fails
                const defaultExtent = [900000, 1550000, 1050000, 1750000];
                newMap.getView().fit(defaultExtent, { padding: [50, 50, 50, 50], duration: 500 });
            }
        });
    }

    return newMap;
}

/**
 * Parse SLD file and extract Rule information (colors, labels, etc.)
 * @param {string} sldContent XML content of SLD file
 * @returns {Array} Array of rule objects with title, fillColor, strokeColor, strokeWidth
 */
function parseSLDRules(sldContent) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sldContent, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
        console.error('Error parsing SLD:', parserError.textContent);
        return [];
    }

    const rules = [];
    const ruleElements = xmlDoc.querySelectorAll('Rule');

    ruleElements.forEach(rule => {
        // Skip "No Data" rules
        const titleElement = rule.querySelector('Title');
        if (!titleElement || titleElement.textContent.trim() === 'No Data') {
            return;
        }

        const title = titleElement ? titleElement.textContent.trim() : '';

        // Extract Fill color
        const fillElement = rule.querySelector('Fill CssParameter[name="fill"]');
        const fillOpacityElement = rule.querySelector('Fill CssParameter[name="fill-opacity"]');
        const fillColor = fillElement ? fillElement.textContent.trim() : '#ffffff';
        const fillOpacity = fillOpacityElement ? parseFloat(fillOpacityElement.textContent.trim()) : 1.0;

        // Convert hex color with opacity to rgba if needed
        let backgroundColor = fillColor;
        if (fillOpacity < 1.0 && fillColor.startsWith('#')) {
            // Convert hex to rgb
            const r = parseInt(fillColor.slice(1, 3), 16);
            const g = parseInt(fillColor.slice(3, 5), 16);
            const b = parseInt(fillColor.slice(5, 7), 16);
            backgroundColor = `rgba(${r}, ${g}, ${b}, ${fillOpacity})`;
        }

        // Extract Stroke color and width
        const strokeElement = rule.querySelector('Stroke CssParameter[name="stroke"]');
        const strokeWidthElement = rule.querySelector('Stroke CssParameter[name="stroke-width"]');
        const strokeColor = strokeElement ? strokeElement.textContent.trim() : '#000000';
        const strokeWidth = strokeWidthElement ? parseFloat(strokeWidthElement.textContent.trim()) : 1;

        rules.push({
            title: title,
            fillColor: backgroundColor,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth
        });
    });

    return rules;
}

/**
 * Fetch and parse SLD file to get legend information
 * @param {string} styleName Style name (e.g., 'z_area_km2', 'c_area_km2', 'reg_z_area_km2')
 * @returns {Promise<Array>} Promise that resolves to array of rule objects
 */
async function fetchSLDRules(styleName) {
    try {
        // Get layer name based on current level
        const layerName = LAYER_NAMES[currentLevel];
        // Fetch SLD from layer-specific folder
        // Note: styleName already includes 'reg_' prefix for regional level
        const response = await fetch(`/static/sld/${layerName}/${styleName}.sld`, {
            cache: 'no-store'  // 캐시 무효화
        });
        if (!response.ok) {
            console.error(`Failed to fetch SLD file: ${layerName}/${styleName}.sld`);
            return [];
        }
        const sldContent = await response.text();
        return parseSLDRules(sldContent);
    } catch (error) {
        console.error(`Error fetching SLD file ${LAYER_NAMES[currentLevel]}/${styleName}.sld:`, error);
        return [];
    }
}

/**
 * Create and display a legend for a map using SLD Rule information.
 * Uses the same styling as simulation page's population legend.
 * @param {string} mapId The ID of the map (e.g., 'map-1')
 * @param {string} styleName Style name (e.g., 'z_area_km2', 'c_area_km2')
 * @param {string} indicatorKey Current indicator key for title
 */
async function createLegendForMap(mapId, styleName, indicatorKey) {
    const mapWrapper = document.getElementById(`${mapId}-wrapper`);
    if (!mapWrapper) {
        console.warn(`Map wrapper not found: ${mapId}-wrapper`);
        return;
    }

    // Remove existing legend if any
    const existingLegend = mapWrapper.querySelector('.map-legend');
    if (existingLegend) {
        existingLegend.remove();
    }

    // Fetch and parse SLD rules from local file
    // If SLD file doesn't exist, fetchSLDRules will return empty array and no legend will be shown
    const rules = await fetchSLDRules(styleName);
    if (rules.length === 0) {
        // No SLD file found for this style, no legend will be displayed (silently fail)
        return;
    }

    // Get indicator display name
    const indicatorDisplayName = getIndicatorDisplayName(indicatorKey);
    const unit = UNIT_MAPPING[currentLevel] && UNIT_MAPPING[currentLevel][indicatorKey]
        ? UNIT_MAPPING[currentLevel][indicatorKey]
        : '';

    // Create legend items HTML
    const legendItemsHtml = rules.map(rule => {
        const borderStyle = rule.strokeWidth > 0
            ? `border: ${rule.strokeWidth}px solid ${rule.strokeColor};`
            : 'border: 1px solid #cccccc;';

        return `
            <div class="legend-item">
                <span class="legend-color" style="background-color: ${rule.fillColor}; ${borderStyle}"></span>
                <span class="legend-label">${rule.title}</span>
            </div>
        `;
    }).join('');

    // Create legend container (using same class names as simulation page)
    const legendContainer = document.createElement('div');
    legendContainer.className = 'map-legend';
    legendContainer.innerHTML = `
        <div class="legend-title">${indicatorDisplayName}</div>
        ${unit ? `<div class="legend-unit">단위: ${unit}</div>` : ''}
        <div class="legend-items">
            ${legendItemsHtml}
        </div>
    `;

    // Append to map wrapper
    mapWrapper.appendChild(legendContainer);
}

/**
 * Get display name for indicator key
 * @param {string} indicatorKey 
 * @returns {string} Display name
 */
function getIndicatorDisplayName(indicatorKey) {
    // Use COLUMN_MAPPING to get display name dynamically
    const mapping = COLUMN_MAPPING[currentLevel];
    return mapping && mapping[indicatorKey] ? mapping[indicatorKey] : indicatorKey;
}


// Global variables for feature highlight
let highlightOverlay = null;
let clickedFeatureGeometry = null;

/**
 * Handles feature click event using WMS GetFeatureInfo and shows attribute popup.
 * @param {ol.MapBrowserEvent} event
 * @param {ol.Map} mapInstance
 * @param {string} mapId
 * @param {string} layerName Full layer name (workspace:layer)
 * @param {string} indicatorKey Current indicator being displayed on this map
 */
async function handleMapClickWithWMS(event, mapInstance, mapId, layerName, indicatorKey) {
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

                    // Store geometry for highlight
                    clickedFeatureGeometry = feature.geometry;

                    // Highlight the clicked feature
                    highlightClickedFeature(mapInstance, feature.geometry);

                    // Show attribute popup with limited info
                    showAttributePopup(event.coordinate, mapInstance, props, indicatorKey);

                    // Update radar chart with clicked feature data
                    const regionName = props.nm || props.name || props.지역명 || props.NAME || '지역';
                    await updateRadarChartWithFeature(mapId, regionName, props);
                } else {
                    hideAttributePopup();
                    removeFeatureHighlight(mapInstance);
                    // Reset radar chart when clicking empty area
                    resetRadarChart(mapId);
                }
            })
            .catch(error => {
                console.error('Error fetching feature info:', error);
                hideAttributePopup();
                removeFeatureHighlight(mapInstance);
            });
    } else {
        hideAttributePopup();
        removeFeatureHighlight(mapInstance);
    }
}

/**
 * Highlight the clicked feature with an overlay
 * @param {ol.Map} map Map instance
 * @param {Object} geometry Feature geometry from GeoJSON
 */
function highlightClickedFeature(map, geometry) {
    // Remove existing highlight
    removeFeatureHighlight(map);

    // Create a vector layer for highlighting
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
                color: '#00ff88', // Bright green-cyan fluorescent color
                width: 5,
                lineCap: 'round',
                lineJoin: 'round'
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 136, 0.15)' // Light green-cyan fill
            })
        }),
        zIndex: 1000
    });

    // Add glow effect with multiple stroke layers for fluorescent effect
    const glowStyle = [
        // Outer glow (larger, more transparent)
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 255, 200, 0.6)',
                width: 9,
                lineCap: 'round',
                lineJoin: 'round'
            })
        }),
        // Middle glow
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 255, 150, 0.8)',
                width: 7,
                lineCap: 'round',
                lineJoin: 'round'
            })
        }),
        // Inner bright stroke
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
    clickedFeatureGeometry = null;
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
        const categoryId = category.replace(/\s/g, '-').toLowerCase(); // Create safe ID for category

        // Start of a new category block with aesthetic improvements
        let categoryHtml = `
            <div class="category-block mb-2 last:mb-0 p-2 border border-sky-200 rounded-xl shadow-md shadow-sky-50 bg-gray-50/80 backdrop-blur-sm">
                <div class="flex items-center justify-between mb-1 border-b border-sky-200 pb-1">
                    <p class="text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">${category} (${indicators.length}종)</p>
                    <button type="button" class="category-toggle-btn text-xs px-2 py-1 bg-sky-100 hover:bg-sky-200 text-sky-600 rounded transition-colors duration-200" data-category="${categoryId}" data-indicators="${indicators.join(',')}">
                        전체 선택
                    </button>
                </div>
                <!-- Responsive Grid for indicators: 2 columns on all screens -->
                <div class="grid grid-cols-2 gap-x-3 gap-y-1">
        `;

        indicators.forEach(indicator => {
            // Replace special characters in indicator name for valid HTML ID
            const id = `chk-${indicator.replace(/[\s\(\)\/]/g, '_')}`;
            // Get Korean name from mapping, fallback to indicator if not found
            const koreanName = COLUMN_MAPPING[currentLevel][indicator] || indicator;
            categoryHtml += `
                <div class="flex items-center">
                    <input id="${id}" type="checkbox" name="indicator" value="${indicator}" class="h-4 w-4 text-sky-500 border-gray-300 bg-white rounded focus:ring-sky-500 focus:ring-2 cursor-pointer">
                    <!-- Use text-xs for smaller font and title for full name, truncate long names -->
                    <label for="${id}" class="ml-2 block text-xs text-gray-700 hover:text-sky-600 cursor-pointer truncate transition-colors duration-200" title="${koreanName}">${koreanName}</label>
                </div>
            `;
        });

        categoryHtml += `</div></div>`;
        $container.append(categoryHtml);
    }

    // Add event handlers for category toggle buttons
    $('.category-toggle-btn').on('click', function () {
        const $btn = $(this);
        const indicators = $btn.data('indicators').split(',');
        const categoryCheckboxes = indicators.map(ind => `#chk-${ind.replace(/[\s\(\)\/]/g, '_')}`);

        // Check if all indicators in this category are selected
        const allSelected = categoryCheckboxes.every(selector => $(selector).is(':checked'));

        // Toggle all checkboxes in this category
        categoryCheckboxes.forEach(selector => {
            $(selector).prop('checked', !allSelected);
        });

        // Update button text
        $btn.text(allSelected ? '전체 선택' : '전체 해제');

        // Trigger change event to update visualization if needed
        $(categoryCheckboxes[0]).trigger('change');
    });

    // Update button text when individual checkboxes change
    $('input[name="indicator"]').on('change', function () {
        updateCategoryToggleButtons();
    });

    // Initial update of button texts
    updateCategoryToggleButtons();

    // No limit on checkbox selection (removed 4-item limit)
}

/**
 * Update category toggle button texts based on current selection state
 */
function updateCategoryToggleButtons() {
    const data = MOCK_DATA[currentLevel];

    for (const category in data.categories) {
        const indicators = data.categories[category];
        const categoryId = category.replace(/\s/g, '-').toLowerCase();
        const categoryCheckboxes = indicators.map(ind => `#chk-${ind.replace(/[\s\(\)\/]/g, '_')}`);

        // Check if all indicators in this category are selected
        const allSelected = categoryCheckboxes.every(selector => $(selector).is(':checked'));
        const noneSelected = categoryCheckboxes.every(selector => !$(selector).is(':checked'));

        // Update button text
        const $btn = $(`.category-toggle-btn[data-category="${categoryId}"]`);
        if (allSelected) {
            $btn.text('전체 해제');
        } else {
            $btn.text('전체 선택');
        }
    }
}

/**
 * Displays a custom message box instead of alert.
 * @param {string} title
 * @param {string} message
 */
function displayMessage(title, message) {
    // Create a simple modal/message box dynamically
    const $modal = $(`
        <div id="custom-alert" class="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center transition-opacity duration-300 opacity-0" style="z-index: 9999;">
            <div class="bg-white p-6 rounded-lg shadow-xl w-80 transform scale-95 transition-transform duration-300 border border-gray-200">
                <h3 class="text-lg font-bold ${title === '경고' ? 'text-red-500' : 'text-sky-600'} mb-3">${title}</h3>
                <p class="text-sm text-gray-700 mb-4">${message}</p>
                <button class="w-full bg-sky-400 hover:bg-sky-500 text-white font-medium py-2 rounded-lg transition-colors duration-200" onclick="$('#custom-alert').remove()">확인</button>
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
    $('#living-area-toggle button').removeClass('bg-gradient-to-r from-sky-400 to-blue-400 text-white shadow-md')
        .addClass('text-gray-600 hover:text-gray-800 hover:bg-gray-200');
    $(this).removeClass('text-gray-600 hover:text-gray-800 hover:bg-gray-200')
        .addClass('bg-gradient-to-r from-sky-400 to-blue-400 text-white shadow-md');

    currentLevel = selectedLevel;
    updateIndicatorsUI();

    // Select the first indicator from 기본현황 and visualize
    setTimeout(() => {
        const firstIndicator = MOCK_DATA[currentLevel].categories["기본현황"][0];
        const safeId = `#chk-${firstIndicator.replace(/[\s\(\)\/]/g, '_')}`;
        // Uncheck all first
        $('input[name="indicator"]').prop('checked', false);
        // Check the first indicator
        $(safeId).prop('checked', true);
        // Re-render map/chart for new default state
        visualizeMap();
    }, 100);
});


/**
 * '시각화하기' button handler. Single map with arrow navigation.
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

    // Get selected indicators
    selectedIndicators = $('input[name="indicator"]:checked').map(function () {
        return $(this).val();
    }).get();

    // Reset to first indicator
    currentIndicatorIndex = 0;

    // If no indicators selected, use first from 기본현황
    if (selectedIndicators.length === 0) {
        const firstIndicator = MOCK_DATA[currentLevel].categories["기본현황"][0];
        selectedIndicators = [firstIndicator];
    }

    const $mapContainer = $('#map-container');
    $mapContainer.empty();

    // Create single map container with navigation arrows
    const mapId = 'map-1';
    const currentIndicator = selectedIndicators[currentIndicatorIndex];
    const mapping = COLUMN_MAPPING[currentLevel];
    const koreanName = mapping[currentIndicator] || currentIndicator;

    // Create map HTML with navigation arrows
    const mapHtml = `
        <div id="${mapId}-wrapper" class="map-wrapper relative">
            ${selectedIndicators.length > 1 ? `
                <button id="prev-indicator" class="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-sky-600 rounded-full p-2 shadow-md border border-sky-200 transition-all duration-200 ${currentIndicatorIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:border-sky-300'}" title="이전 지표">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <button id="next-indicator" class="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-sky-600 rounded-full p-2 shadow-md border border-sky-200 transition-all duration-200 ${currentIndicatorIndex === selectedIndicators.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:border-sky-300'}" title="다음 지표">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            ` : ''}
            <div id="${mapId}" class="map flex-grow">
                <div class="map-title-overlay" title="${koreanName}">
                    ${koreanName} (${currentIndicatorIndex + 1}/${selectedIndicators.length})
                </div>
                <div class="radar-chart-overlay">
                    <canvas id="radarChart-1"></canvas>
                </div>
            </div>
        </div>
    `;
    $mapContainer.attr('class', 'h-full');
    $mapContainer.append(mapHtml);

    // Create single map
    const newMap = createSingleMap(mapId, currentIndicator, null);
    activeMaps.push(newMap);

    // Create legend for map (will try to fetch SLD from local file, if not found, no legend will be shown)
    // Add 'reg_' prefix for regional level
    const styleNameForLegend = currentLevel === 'regional' ? `reg_${currentIndicator}` : currentIndicator;
    createLegendForMap(mapId, styleNameForLegend, currentIndicator);

    // Initialize radar chart
    setTimeout(async () => {
        newMap.updateSize();
        const chart = await initRadarChartForMap(mapId);
        if (chart) {
            chart.map = newMap;
        }
    }, 100);

    // Setup navigation arrows
    if (selectedIndicators.length > 1) {
        $('#prev-indicator').on('click', function () {
            if (currentIndicatorIndex > 0) {
                currentIndicatorIndex--;
                updateMapIndicator();
            }
        });

        $('#next-indicator').on('click', function () {
            if (currentIndicatorIndex < selectedIndicators.length - 1) {
                currentIndicatorIndex++;
                updateMapIndicator();
            }
        });
    }
}

/**
 * Update map to show current indicator
 */
async function updateMapIndicator() {
    if (selectedIndicators.length === 0) return;

    const currentIndicator = selectedIndicators[currentIndicatorIndex];
    const mapping = COLUMN_MAPPING[currentLevel];
    const koreanName = mapping[currentIndicator] || currentIndicator;

    // Update map title
    $('.map-title-overlay').text(`${koreanName} (${currentIndicatorIndex + 1}/${selectedIndicators.length})`);

    // Use currentIndicator as styleName, add 'reg_' prefix for regional level
    const styleName = currentLevel === 'regional' ? `reg_${currentIndicator}` : currentIndicator;

    // Update map indicator key
    if (activeMaps.length > 0) {
        const map = activeMaps[0];
        map.set('indicatorKey', currentIndicator);

        // Update WMS layer params to reflect new indicator
        const wmsLayer = map.getLayers().getArray().find(layer =>
            layer instanceof ol.layer.Image && layer.getSource() instanceof ol.source.ImageWMS
        );
        if (wmsLayer) {
            // Always update STYLES parameter - GeoServer will use default style if style doesn't exist
            wmsLayer.getSource().updateParams({
                'STYLES': styleName
            });
        }

        // Update legend (will try to fetch SLD from local file, if not found, existing legend will be removed)
        const mapId = 'map-1';
        await createLegendForMap(mapId, styleName, currentIndicator);
    }

    // Update navigation arrows
    if (selectedIndicators.length > 1) {
        $('#prev-indicator').toggleClass('opacity-50 cursor-not-allowed', currentIndicatorIndex === 0);
        $('#next-indicator').toggleClass('opacity-50 cursor-not-allowed', currentIndicatorIndex === selectedIndicators.length - 1);
    }

    // Update radar chart
    const mapId = 'map-1';
    if (radarCharts[mapId]) {
        initRadarChartForMap(mapId);
    }
}

// --- CHART.JS FUNCTIONS ---

/**
 * Normalize value using min-max normalization (0-100)
 * @param {number} value Value to normalize
 * @param {number} min Minimum value in dataset
 * @param {number} max Maximum value in dataset
 * @param {boolean} reverse If true, apply inverse normalization (higher value = lower score)
 * @returns {number} Normalized value (0-100)
 */
function normalizeValue(value, min, max, reverse = false) {
    if (min === max) return 50; // If all values are same, return middle value

    if (reverse) {
        // Inverse normalization: (max - value) / (max - min) * 100
        return ((max - value) / (max - min)) * 100;
    } else {
        // Normal normalization: (value - min) / (max - min) * 100
        return ((value - min) / (max - min)) * 100;
    }
}

/**
 * Fetch average data for selected diagnostic indicators from GeoServer and normalize
 * This will be used to show overall average in radar chart
 * Only includes selected diagnostic indicators (콤팩트성, 네트워크성, 생활편리성)
 * @returns {Promise<Object>} Promise resolving to { labels, data } for normalized average values
 */
async function fetchAverageDataForAllIndicators() {
    // Get only selected diagnostic indicators
    const diagnosticIndicators = getDiagnosticIndicators();
    // Filter selected indicators to only include diagnostic ones
    const labels = selectedIndicators.length > 0
        ? selectedIndicators.filter(ind => diagnosticIndicators.includes(ind))
        : diagnosticIndicators; // If nothing selected, show all diagnostic indicators
    const layerName = LAYER_NAMES[currentLevel];
    const fullLayerName = `${GEOSERVER_WORKSPACE}:${layerName}`;
    const reverseIndicators = REVERSE_INDICATORS[currentLevel] || [];

    try {
        // Use WFS to get all features and calculate average
        const wfsUrl = `${GEOSERVER_URL}/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=${fullLayerName}&outputFormat=application/json&maxFeatures=1000`;
        const response = await fetch(wfsUrl);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            // For each indicator, collect all values, find min/max, then normalize average
            const normalizedAverages = labels.map(indicatorKey => {
                // Collect all values for this indicator
                const values = data.features
                    .map(f => {
                        const val = f.properties[indicatorKey];
                        return val !== null && val !== undefined && !isNaN(parseFloat(val))
                            ? parseFloat(val)
                            : null;
                    })
                    .filter(v => v !== null);

                if (values.length === 0) return 50; // Default to middle if no values

                // Find min and max
                const min = Math.min(...values);
                const max = Math.max(...values);

                // Calculate average
                const sum = values.reduce((acc, val) => acc + val, 0);
                const avg = sum / values.length;

                // Check if this indicator needs reverse normalization
                const isReverse = reverseIndicators.includes(indicatorKey);

                // Normalize the average value
                return normalizeValue(avg, min, max, isReverse);
            });

            return { labels: labels, data: normalizedAverages };
        }
    } catch (error) {
        console.error('Error fetching average data:', error);
    }

    // Fallback to mock data if fetch fails
    const scores = labels.map(() => Math.floor(Math.random() * 50) + 50);
    return { labels: labels, data: scores };
}

/**
 * Initialize or reset the Radar Chart for a specific map.
 * @param {string} mapId The ID of the map (e.g., 'map-1')
 */
async function initRadarChartForMap(mapId) {
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

    // Fetch actual average data
    const averageData = await fetchAverageDataForAllIndicators();

    // Prepare label for 2-line display
    const avgLabelLine1 = '전체 평균';
    const avgLabelLine2 = MOCK_DATA[currentLevel].levelName;

    radarCharts[mapId] = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: averageData.labels, // ALL 34 or 21 indicators become the labels
            datasets: [{
                label: `${avgLabelLine1}\n${avgLabelLine2}`,
                _labelLine1: avgLabelLine1,
                _labelLine2: avgLabelLine2,
                data: averageData.data,
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // Blue for average
                borderColor: 'rgb(59, 130, 246)',
                pointRadius: 2,
                pointHitRadius: 8,
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
                        font: { size: 9 },
                        padding: 5,
                        callback: function (label) {
                            // Shorten labels to prevent overlap
                            const mapping = COLUMN_MAPPING[currentLevel];
                            const shortLabel = label.split(' ')[0];
                            // Try to get Korean name if available
                            return mapping[shortLabel] ? mapping[shortLabel].substring(0, 8) : shortLabel.substring(0, 8);
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
                        font: { size: 10 },
                        boxWidth: 12,
                        padding: 10,
                        generateLabels: function (chart) {
                            const original = Chart.defaults.plugins.legend.labels.generateLabels;
                            const labels = original.call(this, chart);
                            // Process labels to support 2-line display
                            labels.forEach((label, index) => {
                                const dataset = chart.data.datasets[index];
                                if (dataset && dataset._labelLine1 && dataset._labelLine2) {
                                    label.text = dataset._labelLine1;
                                    label.textLine2 = dataset._labelLine2;
                                } else if (label.text && label.text.includes('\n')) {
                                    const parts = label.text.split('\n');
                                    label.text = parts[0];
                                    label.textLine2 = parts[1];
                                }
                            });
                            return labels;
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function (context) {
                            // First line: dataset label (region name or "전체 평균 기초생활권")
                            const datasetLabel = context[0].dataset.label;
                            // Extract first line if it contains \n
                            if (datasetLabel.includes('\n')) {
                                return datasetLabel.split('\n')[0];
                            }
                            return datasetLabel;
                        },
                        label: function (context) {
                            // Second line: indicator Korean name + value (no unit, as it's normalized 0-100)
                            const mapping = COLUMN_MAPPING[currentLevel];
                            const indicatorKey = context.label;
                            const koreanName = mapping[indicatorKey] || indicatorKey;
                            const valueText = context.parsed.r.toFixed(2);
                            return koreanName + ' : ' + valueText;
                        }
                    }
                },
                // Custom plugin to render 2-line legend labels
                customLegend: {
                    afterDraw: function (chart) {
                        const ctx = chart.ctx;
                        const legend = chart.legend;
                        if (!legend || !legend.legendItems) return;

                        ctx.save();
                        ctx.font = '10px Arial';
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'middle';

                        legend.legendItems.forEach((item) => {
                            if (item.textLine2) {
                                const x = item.x + (item.fillStyle ? 20 : 0);
                                const y = item.y + 12;
                                ctx.fillStyle = item.strokeStyle || '#666';
                                ctx.fillText(item.textLine2, x, y);
                            }
                        });
                        ctx.restore();
                    }
                }
            }
        }
    });

    return radarCharts[mapId];
}

/**
 * Update Radar Chart with the selected feature's data for a specific map.
 * Data is normalized using min-max normalization (0-100)
 * @param {string} mapId The ID of the map
 * @param {string} regionName
 * @param {Object} props Feature properties
 */
async function updateRadarChartWithFeature(mapId, regionName, props) {
    const chart = radarCharts[mapId];
    if (!chart) {
        console.warn(`Chart not found for map: ${mapId}`);
        return;
    }

    // Get only selected diagnostic indicators
    const diagnosticIndicators = getDiagnosticIndicators();
    // Filter selected indicators to only include diagnostic ones
    const allIndicators = selectedIndicators.length > 0
        ? selectedIndicators.filter(ind => diagnosticIndicators.includes(ind))
        : diagnosticIndicators; // If nothing selected, show all diagnostic indicators
    const layerName = LAYER_NAMES[currentLevel];
    const fullLayerName = `${GEOSERVER_WORKSPACE}:${layerName}`;
    const reverseIndicators = REVERSE_INDICATORS[currentLevel] || [];

    try {
        // Fetch all features to calculate min/max for normalization
        const wfsUrl = `${GEOSERVER_URL}/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=${fullLayerName}&outputFormat=application/json&maxFeatures=1000`;
        const response = await fetch(wfsUrl);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            // Normalize feature values using min-max from all features
            const normalizedScores = allIndicators.map(indicatorKey => {
                // Get feature value
                const featureValue = props[indicatorKey];
                if (featureValue === null || featureValue === undefined || isNaN(parseFloat(featureValue))) {
                    return 50; // Default to middle if value is missing
                }
                const value = parseFloat(featureValue);

                // Collect all values for this indicator to find min/max
                const allValues = data.features
                    .map(f => {
                        const val = f.properties[indicatorKey];
                        return val !== null && val !== undefined && !isNaN(parseFloat(val))
                            ? parseFloat(val)
                            : null;
                    })
                    .filter(v => v !== null);

                if (allValues.length === 0) return 50;

                const min = Math.min(...allValues);
                const max = Math.max(...allValues);

                // Check if this indicator needs reverse normalization
                const isReverse = reverseIndicators.includes(indicatorKey);

                // Normalize the value
                return normalizeValue(value, min, max, isReverse);
            });

            // Check if the feature dataset already exists and remove it
            if (chart.data.datasets.length > 1) {
                chart.data.datasets.pop();
            }

            // Get the current indicator key for this map to show in legend
            // Find the map instance to get indicatorKey
            const mapInstance = activeMaps.find(m => {
                const target = m.getTarget();
                const targetId = typeof target === 'string' ? target : target?.id;
                return targetId === mapId;
            });
            const mapIndicatorKey = mapInstance?.get('indicatorKey') || '';
            const indicatorKoreanName = COLUMN_MAPPING[currentLevel][mapIndicatorKey] || '';

            // Store label parts for 2-line display
            const labelLine1 = regionName;
            const labelLine2 = indicatorKoreanName;

            // Add the new feature dataset with red color
            chart.data.datasets.push({
                label: `${labelLine1}\n${labelLine2}`,
                _labelLine1: labelLine1,
                _labelLine2: labelLine2,
                data: normalizedScores,
                backgroundColor: 'rgba(239, 68, 68, 0.25)', // Red with opacity
                borderColor: 'rgb(239, 68, 68)',
                pointRadius: 2,
                pointHitRadius: 8,
                pointBackgroundColor: 'rgb(239, 68, 68)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(239, 68, 68)'
            });

            chart.update();
        }
    } catch (error) {
        console.error('Error normalizing feature data:', error);
    }
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

// --- ATTRIBUTE POPUP FUNCTIONS ---

let attributePopup = null; // Global popup overlay

/**
 * Show attribute information popup with rounded, soft design and animation
 * Shows only 3 attributes: 지역명 (nm), 상위 지역 (up_region), and current indicator value
 * @param {ol.Coordinate} coordinate Clicked coordinate
 * @param {ol.Map} map Map instance
 * @param {Object} properties Feature properties
 * @param {string} indicatorKey Current indicator key being displayed
 */
function showAttributePopup(coordinate, map, properties, indicatorKey) {
    // Remove existing popup immediately (synchronously) if any
    if (attributePopup) {
        const element = attributePopup.getElement();
        if (element) {
            // Cancel any pending timeout
            if (attributePopup._hideTimeout) {
                clearTimeout(attributePopup._hideTimeout);
            }
            // Remove immediately without animation
            activeMaps.forEach(m => {
                if (m && attributePopup) {
                    m.removeOverlay(attributePopup);
                }
            });
        }
        attributePopup = null;
    }

    // Get region name and upper region
    const regionName = properties.nm || properties.name || properties.지역명 || properties.NAME || '지역';
    const upperRegion = properties.up_region || properties.상위지역 || null;
    const mapping = COLUMN_MAPPING[currentLevel];
    const allIndicators = getAllIndicators();

    // Build title based on level
    let title = regionName;
    if (currentLevel === 'basic' && upperRegion) {
        title = `${regionName}(${upperRegion})`;
    }

    // Build HTML content with all attributes in 3 columns
    let content = `<div class="attribute-popup-content">`;
    content += `<h3 class="attribute-popup-title">${title}</h3>`;
    content += `<div class="attribute-list attribute-list-3col">`;

    // Display all indicators in 3 columns
    const unitMapping = UNIT_MAPPING[currentLevel] || {};
    allIndicators.forEach((indicatorKey, index) => {
        const koreanName = mapping[indicatorKey] || indicatorKey;
        const value = properties[indicatorKey] !== undefined && properties[indicatorKey] !== null
            ? properties[indicatorKey]
            : '-';

        // Format value if it's a number
        let formattedValue = value;
        if (typeof value === 'number') {
            formattedValue = value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
        }

        // Get unit for this indicator
        const unit = unitMapping[indicatorKey] || '';
        const valueWithUnit = unit ? `${formattedValue} ${unit}` : formattedValue;

        content += `<div class="attribute-item">`;
        content += `<span class="attribute-name">${koreanName}</span>`;
        content += `<span class="attribute-value">${valueWithUnit}</span>`;
        content += `</div>`;
    });

    content += `</div>`;
    content += `</div>`;

    // Create popup element
    const popupElement = document.createElement('div');
    popupElement.className = 'attribute-popup attribute-popup-enter';
    popupElement.innerHTML = content;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'attribute-popup-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => hideAttributePopup();
    popupElement.appendChild(closeBtn);

    // Make entire popup draggable
    popupElement.style.cursor = 'move';
    popupElement.style.userSelect = 'none';

    // Create overlay
    attributePopup = new ol.Overlay({
        element: popupElement,
        positioning: 'bottom-center',
        stopEvent: true, // Prevent map events when interacting with popup
        offset: [0, -10],
        insertFirst: false
    });

    map.addOverlay(attributePopup);
    attributePopup.setPosition(coordinate);

    // Make popup draggable from anywhere
    let dragStart = null;
    let dragOffset = [0, 0];

    const handleMouseDown = (e) => {
        // Allow dragging from anywhere except close button
        if (e.target !== closeBtn && !closeBtn.contains(e.target)) {
            dragStart = [e.clientX, e.clientY];
            const position = attributePopup.getPosition();
            if (position) {
                const pixel = map.getPixelFromCoordinate(position);
                dragOffset = [pixel[0] - e.clientX, pixel[1] - e.clientY];
            }
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    };

    const handleMouseMove = (e) => {
        if (dragStart) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const newPixel = [
                e.clientX + dragOffset[0],
                e.clientY + dragOffset[1]
            ];
            const newCoordinate = map.getCoordinateFromPixel(newPixel);
            attributePopup.setPosition(newCoordinate);
        }
    };

    const handleMouseUp = (e) => {
        if (dragStart) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        dragStart = null;
    };

    // Prevent map interaction when interacting with popup
    const handlePopupMouseEnter = (e) => {
        // Stop event propagation to prevent map interactions
        e.stopPropagation();
        e.stopImmediatePropagation();
    };

    const handlePopupWheel = (e) => {
        // Prevent map zoom when scrolling inside popup
        e.stopPropagation();
        e.stopImmediatePropagation();
    };

    // Add event listeners for dragging
    popupElement.addEventListener('mousedown', handleMouseDown);
    popupElement.addEventListener('mouseenter', handlePopupMouseEnter);
    popupElement.addEventListener('wheel', handlePopupWheel, { passive: false });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Store cleanup function
    attributePopup._cleanupDrag = () => {
        popupElement.removeEventListener('mousedown', handleMouseDown);
        popupElement.removeEventListener('mouseenter', handlePopupMouseEnter);
        popupElement.removeEventListener('wheel', handlePopupWheel);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Trigger animation
    setTimeout(() => {
        popupElement.classList.remove('attribute-popup-enter');
        popupElement.classList.add('attribute-popup-visible');
    }, 10);
}

/**
 * Hide attribute popup with animation
 */
function hideAttributePopup() {
    if (attributePopup) {
        const element = attributePopup.getElement();
        if (element) {
            // Cancel any pending timeout
            if (attributePopup._hideTimeout) {
                clearTimeout(attributePopup._hideTimeout);
            }

            // Cleanup drag event listeners
            if (attributePopup._cleanupDrag) {
                attributePopup._cleanupDrag();
            }

            // Trigger exit animation
            element.classList.remove('attribute-popup-visible');
            element.classList.add('attribute-popup-exit');

            // Remove after animation completes
            attributePopup._hideTimeout = setTimeout(() => {
                activeMaps.forEach(map => {
                    if (map && attributePopup) {
                        map.removeOverlay(attributePopup);
                    }
                });
                attributePopup = null;
            }, 300); // Match CSS animation duration
        } else {
            activeMaps.forEach(map => {
                if (map && attributePopup) {
                    map.removeOverlay(attributePopup);
                }
            });
            attributePopup = null;
        }
    }
    // Also remove highlight when popup is closed
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

    // 1. Initialize Vector Source
    initVectorSource();

    // 2. Initialize Control Panel UI (Default: Basic)
    updateIndicatorsUI();

    // 3. Set initial map visualization (Default: Basic/기본현황 중 1개 표시)
    // Select the first indicator and visualize it as a single map
    const firstIndicator = MOCK_DATA[currentLevel].categories["기본현황"][0];
    // Replace special characters in indicator name for valid HTML ID
    const safeId = `#chk-${firstIndicator.replace(/[\s\(\)\/]/g, '_')}`;

    setTimeout(() => {
        // Check the default indicator and run visualization
        $(safeId).prop('checked', true);
        visualizeMap();
    }, 500);

    // 4. Intent Modal is now handled by intent-modal.js (loaded before this file)
});

