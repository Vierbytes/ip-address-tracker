# <a name="project"></a>IP Address Tracker

Frontend Mentor Challenge - Track IP addresses and display location on interactive map
![images](https://github.com/Vierbytes/ip-address-tracker/blob/main/images/ip-pin.png)


## <a name="toc"></a>Table of Contents

  - [IP Address Tracker](#ip-address-tracker)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Trello Planning](#trello-planning)
  - [Deployed Link](#deployed-link)
  - [Wireframe](#wireframe)


## <a name="features"></a>Features
- View IP geolocation data
- Search any IP address or domain
- Interactive map with custom markers
- Responsive design

## <a name="technologiesused"></a>Technologies Used
- **HTML5**: Semantic markup for accessibility
- **CSS3**: Custom properties for maintainable styling, CSS Grid and Flexbox for responsive layouts
- **JavaScript ES6+**: Async/await for API calls, DOM manipulation
- **Leaflet.js**: Interactive map library
- **IP Geolocation API**: Real-time IP location data

## <a name="planning"></a>Trello Planning
* https://trello.com/b/ZaDQKP0I/project-1-ip-address-tracker

## <a name="deployment"></a>Deployed Link
* Netlify Deployed Site:
[Netlify](https://ip-pin.netlify.app/)

* You can view the repository:
[Github.com](https://github.com/Vierbytes/ip-address-tracker)

## Wireframe
* https://www.figma.com/design/w3Gv9WYz5ItvfY1rJrMYzd/Project-1--IP-Address-Tracker?m=auto&t=DxdtzRbBKFIwI7u2-6


# IP Address Tracker - Development Reflection

## Project Overview
This project is an IP Address Tracker built as part of the Frontend Mentor challenge. It allows users to search for any IP address or domain and displays the corresponding geolocation data on an interactive map using Leaflet.js and the IP Geolocation API.

## Development Process

### Planning Phase
I began by creating wireframes in Figma to visualize the layout and component structure. I then organized my workflow using a task management system **Trello** to break down the project into manageable weekly goals. This planning phase helped me understand the scope and set realistic timelines.

### Implementation Approach
I followed a mobile-first responsive design approach, starting with the smallest screen sizes and progressively enhancing for larger viewports. I structured the project with separation of concerns - configuration in `config.js`, styling in `style.css`, and logic in `script.js`.

## Challenges Faced

### Challenge 1: API Integration
**Problem**: Understanding how to properly structure API calls with async/await and handle various response scenarios (successful requests, network errors, rate limiting, invalid inputs).

**Solution**: I implemented comprehensive error handling with try-catch blocks and created user-friendly error messages. I added input validation to check whether the user entered a valid IP address or domain before making API calls, reducing unnecessary requests.

```javascript
async function getIPData(query = '') {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        updateUI(data);
        updateMap(data.location.lat, data.location.lng);
    } catch (error) {
        showError(getUserFriendlyErrorMessage(error));
    }
}
```

### Challenge 2: Map Integration with Leaflet.js
**Problem**: Initially struggled with understanding how Leaflet's tile system works and how to properly initialize the map, manage markers, and handle dynamic updates when users search for different locations.

**Solution**: I spent time reading Leaflet documentation and experimenting with different methods. I created separate functions for initializing the map and updating it, which improved code organization. The key insight was understanding that the map container needs an explicit height in CSS, and markers need to be removed before adding new ones to prevent clutter.

### Challenge 3: CSS Custom Properties
**Problem**: While I was familiar with basic CSS, implementing a scalable design system using CSS custom properties (variables) was new to me.

**Solution**: I studied how design systems work and created a comprehensive `:root` configuration with colors, spacing scales, font properties, and z-index layers. This approach made it incredibly easy to maintain consistency and make global changes. For example, adjusting all spacing values required changing just a few variables rather than hundreds of individual properties.
