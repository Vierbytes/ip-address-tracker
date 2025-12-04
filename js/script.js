// Global variables
let map
let marker

// DOM elements
const searchForm = document.getElementById('searchForm')
const searchInput = document.getElementById('searchInput')
const loadingSpinner = document.getElementById('loadingSpinner')
const errorMessage = document.getElementById('errorMessage')
const errorText = document.getElementById('errorText')

// Info display elements
const ipAddressEl = document.getElementById('ipAddress')
const locationEl = document.getElementById('location')
const timezoneEl = document.getElementById('timezone')
const ispEl = document.getElementById('isp')

// Calls when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeMap()
    getIPData()
    searchForm.addEventListener('submit', handleSearch)
    // updateMap(51.5074, -0.1278)   // London

})


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
        showError('Failed to initialize map')
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

// ===================================
// API Functions
// ===================================

//  Fetch IP geolocation data
async function getIPData(query = '') {
    showLoading(true)
    hideError()

    try {
        // Call our Netlify serverless function instead of the API directly
        let url = '/.netlify/functions/get-ip-data'

        if (query) {
            url += `?query=${encodeURIComponent(query)}`
        }

        console.log('Fetching IP data...')

        // Fetch data from our serverless function
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        // Check if there's an error in the response
        if (data.error) {
            throw new Error(data.error)
        }

        console.log('IP data received:', data)
        updateUI(data)

        // Update map
        if (data.location && data.location.lat && data.location.lng) {
            updateMap(data.location.lat, data.location.lng)
        }

    } catch (error) {
        console.error('Error fetching IP data:', error)

        // Show user-friendly error message
        let errorMsg = 'Failed to fetch IP data. '
        if (error.message.includes('404')) {
            errorMsg += 'IP address or domain not found.'
        } else if (error.message.includes('403') || error.message.includes('401')) {
            errorMsg += 'Invalid API key. Please check your configuration.'
        } else if (error.message.includes('429')) {
            errorMsg += 'Rate limit exceeded. Please try again later.'
        } else {
            errorMsg += 'Please check your connection and try again.'
        }
        showError(errorMsg)
    } finally {
        showLoading(false)
    }
}

/**
 * Update UI elements with IP data
 * @param {object} data - IP geolocation data from API
 */
function updateUI(data) {
    try {
        // Update IP Address
        ipAddressEl.textContent = data.ip || '—'

        // Update Location (City, Region PostalCode)
        if (data.location) {
            const { city, region, postalCode } = data.location
            const locationParts = [city, region, postalCode].filter(Boolean)
            locationEl.textContent = locationParts.join(', ') || '—'

            // Update Timezone
            timezoneEl.textContent = data.location.timezone
                ? `UTC ${data.location.timezone}`
                : '—'
        } else {
            locationEl.textContent = '—'
            timezoneEl.textContent = '—'
        }

        // Update ISP
        ispEl.textContent = data.isp || '—'

    } catch (error) {
        console.error('Error updating UI:', error)
        showError('Failed to display IP information')
    }
}

// ===================================
// Validation Functions
// ===================================

/**
 * Check if string is a valid IP address
 * @param {string} str - String to validate
 * @returns {boolean}
 */
function isValidIP(str) {
    // IPv4 regex pattern
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/

    if (!ipv4Pattern.test(str)) {
        return false
    }

    // Check each octet is 0-255
    const octets = str.split('.')
    return octets.every(octet => {
        const num = parseInt(octet, 10)
        return num >= 0 && num <= 255
    })
}


/**
 * Check if string is a valid domain
 * @param {string} str - String to validate
 * @returns {boolean}
 */
function isValidDomain(str) {
    // Basic domain regex pattern
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/
    return domainPattern.test(str)
}

// ===================================
// Form Handlers
// ===================================

/**
 * Handle search form submission
 * @param {Event} e - Form submit event
 */
function handleSearch(e) {
    e.preventDefault()

    const query = searchInput.value.trim()

    if (!query) {
        showError('Please enter an IP address or domain')
        return
    }

    // Validate input
    if (!isValidIP(query) && !isValidDomain(query)) {
        showError('Please enter a valid IP address or domain')
        return
    }

    // Fetch data for the query
    getIPData(query)
}


// ===================================
// UI Helper Functions
// ===================================

/**
 * Show/hide loading spinner
 * @param {boolean} show - Whether to show spinner
 */
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.add('active')
    } else {
        loadingSpinner.classList.remove('active')
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorText.textContent = message
    errorMessage.classList.add('active')

    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError()
    }, 5000)
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('active')
}

// Close error message called from HTML
function closeError() {
    hideError()
}