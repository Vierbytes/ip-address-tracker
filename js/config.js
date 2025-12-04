// ===================================
// Configuration File
// ===================================
const CONFIG = {
    // Default map settings
    MAP_DEFAULT_ZOOM: 13,
    MAP_MAX_ZOOM: 19,

    // Leaflet tile layer (using OpenStreetMap)
    TILE_LAYER_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    TILE_LAYER_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}