// Global variables
let map
let marker

// DOM elements
const searchForm = document.getElementById('searchForm')
const searchInput = document.getElementById('searchInput')
const loadingSpinner = document.getElementById('loadingSpinner')

// Info display elements
const ipAddressEl = document.getElementById('ipAddress')
const locationEl = document.getElementById('location')
const timezoneEl = document.getElementById('timezone')
const ispEl = document.getElementById('isp')

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
        console.error('Error initializing map: ', error)
    }
}



function updateMap(lat, lng) {
    if (!map) {
        console.error('Map not initialized')
        return
    }

    try {
        // Update map view
        map.setView([lat, lng], CONFIG.MAP_DEFAULT_ZOOM)

        // Remove existing marker if present
        if (marker) {
            map.removeLayer(marker)
        }

        // Creates custom marker icon
        const customIcon = L.icon({
            iconUrl: '../images/icon-location.svg',
            iconRetinaUrl: '../images/icon-location.svg',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        })

        // Add new marker
        marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
        console.log(marker)  // Should show marker object
        console.log(`Map updated to: ${lat}, ${lng}`)
    } catch (error) {
        console.error('Error updating map: ', error)
        showError('Failed to update map location')
    }
}


initializeMap()
updateMap(33.7501, -84.3885)  // Atlanta
// updateMap(35.6762, 139.6503)  // Tokyo
// updateMap(51.5074, -0.1278)   // London

// Calls when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//     initializeMap()
//     updateMap(51.5074, -0.1278)   // London

// })
