let map
let marker

// ===================================
// Map Functions
// ===================================

// Function to initialize the map
function initializeMap() {
    try {
        // Create the map
        map = L.map('map', {
            center: [40.7128, -74.0060],   // [latitude, longitude]
            zoom: 13,                      // Zoom level 1-19
            zoomControl: true              // Show +/- zoom buttons
        })

        // Add tile layer which are the actual map images
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        console.log('Map initialized successfully')
    } catch (error) {
        console.error('Error initializing map:', error)
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeMap()
})

