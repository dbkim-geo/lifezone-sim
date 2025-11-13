/**
 * Configuration file for GeoServer settings
 * Change the URL below for deployment
 */

// Development
// const GEOSERVER_URL = 'http://localhost:8088/geoserver';

// Production (uncomment for deployment)
const GEOSERVER_URL = 'http://14.5.12.41:8088/geoserver';

const GEOSERVER_WORKSPACE = 'lifesim';

// Export to window object
window.GEOSERVER_URL = GEOSERVER_URL;
window.GEOSERVER_WORKSPACE = GEOSERVER_WORKSPACE;

