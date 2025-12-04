// Netlify Serverless Function
// This runs on Netlify's servers, keeping my API key secret

exports.handler = async (event, context) => {
    // Get the query parameter from the request
    const { query } = event.queryStringParameters || {}

    // Get API key from environment variable that was set in my project's Netlify dashboard
    const apiKey = process.env.IPIFY_API_KEY

    // Check if API key exists
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'API key not configured'
            })
        }
    }

    // Build the API URL
    let url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`

    if (query) {
        // Simple check if it's an IP address
        const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(query)
        url += `&${isIP ? 'ipAddress' : 'domain'}=${encodeURIComponent(query)}`
    }

    try {
        // Fetch data from IPify API
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`)
        }

        const data = await response.json()

        // Return successful response
        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Allow CORS
            }
        }

    } catch (error) {
        console.error('Error fetching IP data:', error)

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to fetch IP data',
                message: error.message
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
}