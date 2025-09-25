// Show loading message
document.getElementById('itineraryList').innerHTML = '<li>Loading itinerary...</li>';
document.getElementById('exploreGrid').innerHTML = '<div>Loading explore data...</div>';

// Use the JSON file specified by the HTML page
const tripJsonFile = window.TRIP_JSON || '';
const jsonPath = './' + tripJsonFile;

fetch(jsonPath)
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(tripData => {
    // Set header title and subtitle
    if (tripData.title) document.getElementById('tripTitle').textContent = tripData.title;
    if (tripData.subtitle) document.getElementById('tripSubtitle').textContent = tripData.subtitle;

    // Apply header styling if provided
    if (tripData.header) {
      const header = document.getElementById('tripHeader');
      const headerContent = header.querySelector('.header-content');
      
      // Set up basic header layout
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'center';
      
      if (tripData.header.backgroundImage) {
        header.style.backgroundImage = `url(${tripData.header.backgroundImage})`;
        header.style.backgroundSize = 'cover';
        header.style.backgroundPosition = 'center';
        header.style.backgroundRepeat = 'no-repeat';
        
        // Only apply overlay if there's a background image
        if (tripData.header.overlay) {
          header.style.position = 'relative';
          header.style.setProperty('--overlay-color', tripData.header.overlay);
          header.style.setProperty('--overlay', `linear-gradient(${tripData.header.overlay}, ${tripData.header.overlay})`);
          header.style.backgroundImage = `var(--overlay), url(${tripData.header.backgroundImage})`;
        }
      }
      
      if (tripData.header.textColor) {
        headerContent.style.color = tripData.header.textColor;
      }
      
      if (tripData.header.height) {
        header.style.height = tripData.header.height;
      }
      
      if (tripData.header.customCSS) {
        const style = document.createElement('style');
        style.textContent = `#tripHeader { ${tripData.header.customCSS} }`;
        document.head.appendChild(style);
      }
    }

    // Load explore locations data
    return fetch('../../data/explore-locations.json')
      .then(response => response.json())
      .then(exploreLocations => {
        // Map explore IDs to full objects
        const exploreData = tripData.explore.map(id => exploreLocations[id]).filter(Boolean);
        
        // Get unique emojis for filters
        const uniqueEmojis = Array.from(new Set(exploreData.flatMap(f => f.emojis)));
        
        return { tripData, exploreData, uniqueEmojis };
      });
  })
  .then(({ tripData, exploreData, uniqueEmojis }) => {

    function renderEmojiFilters(selected) {
      const filters = document.getElementById('emojiFilters');
      filters.innerHTML = '';
      const allBtn = document.createElement('button');
      allBtn.className = 'filter-btn' + (selected === 'all' ? ' active' : '');
      allBtn.textContent = 'All';
      allBtn.onclick = () => filterExplore('all');
      filters.appendChild(allBtn);
      uniqueEmojis.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (selected === emoji ? ' active' : '');
        btn.textContent = emoji;
        btn.onclick = () => filterExplore(emoji);
        filters.appendChild(btn);
      });
    }

    function filterExplore(emoji) {
      renderEmojiFilters(emoji);
      const grid = document.getElementById('exploreGrid');
      grid.innerHTML = '';
      exploreData.filter(f => emoji === 'all' || f.emojis.includes(emoji)).forEach(f => {
        grid.innerHTML += `<div class="food-card"><span class="emoji">${f.emojis.join(' ')}</span> <span class="name">${f.name}</span><div class="desc">${f.desc}</div><div><a href='${f.link}' target='_blank' title='${f.linkText}' style='margin-top:4px;display:inline-block;font-size:0.98rem;color:var(--blue);text-decoration:underline;'>${f.linkText}</a></div></div>`;
      });
    }
    // Initial render
    filterExplore('all');

    // Scrollspy functionality
    const sections = [
      {id: 'itinerary', nav: 'nav-itinerary'},
      {id: 'explore', nav: 'nav-explore'},
      {id: 'map', nav: 'nav-map'}
    ];
    function onScrollSpy() {
      let scrollPos = window.scrollY || window.pageYOffset;
      let offset = 120; // adjust for nav height
      let found = false;
      for (let i = 0; i < sections.length; i++) {
        let sec = document.getElementById(sections[i].id);
        if (sec) {
          let top = sec.offsetTop - offset;
          let nextTop = (i < sections.length - 1) ? document.getElementById(sections[i+1].id).offsetTop - offset : Infinity;
          if (scrollPos >= top && scrollPos < nextTop) {
            document.getElementById(sections[i].nav).classList.add('active');
            found = true;
          } else {
            document.getElementById(sections[i].nav).classList.remove('active');
          }
        }
      }
      // If at the bottom, highlight last
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
        sections.forEach((s, idx) => document.getElementById(s.nav).classList.remove('active'));
        document.getElementById(sections[sections.length-1].nav).classList.add('active');
      }
    }
    window.addEventListener('scroll', onScrollSpy);
    window.addEventListener('resize', onScrollSpy);
    document.addEventListener('DOMContentLoaded', onScrollSpy);

    function renderItinerary(data, containerId = 'itineraryList') {
      const list = document.getElementById(containerId);
      list.innerHTML = '';
      data.forEach(day => {
        const li = document.createElement('li');
        li.innerHTML = `<span class='itinerary-list-header'><strong>${day.label}:</strong></span>`;
        if (day.timeBlocks) {
          li.innerHTML += day.timeBlocks.map(block => {
            return `<div class='itinerary-row'>` +
              `<div class='itinerary-label'>${block.time}</div>` +
              `<div class='itinerary-content'>` +
                block.options.map(opt => {
                  if (opt.title && opt.desc) {
                    const linkHtml = opt.link ? `<br><a href='${opt.link}' target='_blank' style='color: var(--blue); text-decoration: underline; font-size: 0.95em;'>📍 View on Google Maps</a>` : '';
                    return `<div class='itinerary-event'><span class='itinerary-title'>${opt.title}</span><br>${opt.desc}${linkHtml}</div>`;
                  } else if (opt.desc) {
                    return `<div class='itinerary-event'>${opt.desc}</div>`;
                  } else {
                    return `<div class='itinerary-event'>No content</div>`;
                  }
                }).join('') +
              `</div>` +
            `</div>`;
          }).join('');
        }
        list.appendChild(li);
      });
    }
    renderItinerary(tripData.itinerary, 'itineraryList');

    // Initialize map with locations
    initializeMap(tripData, exploreData);
  })
  .catch(err => {
    document.getElementById('itineraryList').innerHTML = '<li>Error loading itinerary.</li>';
    document.getElementById('exploreGrid').innerHTML = '<div>Error loading explore data.</div>';
  });

// Global map variable
let map;

// Initialize Google Maps
function initMap() {
  // This function will be called by the Google Maps API callback
  // The actual map initialization will happen in initializeMap()
}

function initializeMap(tripData, exploreData) {
  // Wait for Google Maps API to be available
  if (typeof google === 'undefined' || !google.maps) {
    setTimeout(() => initializeMap(tripData, exploreData), 100);
    return;
  }

  // Center map on State College, PA (Penn State area)
  const center = { lat: 40.7934, lng: -77.8600 };
  
  map = new google.maps.Map(document.getElementById('mapContainer'), {
    zoom: 13,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  });

  // Collect all locations from itinerary and explore data
  const allLocations = [];
  
  // Extract locations from itinerary
  tripData.itinerary.forEach(day => {
    if (day.timeBlocks) {
      day.timeBlocks.forEach(block => {
        if (block.options) {
          block.options.forEach(option => {
            if (option.link && option.link.includes('google.com/maps')) {
              allLocations.push({
                title: option.title || 'Itinerary Location',
                description: option.desc || '',
                link: option.link,
                type: 'itinerary',
                emoji: '🗓️'
              });
            }
          });
        }
      });
    }
  });

  // Extract locations from explore data
  exploreData.forEach(location => {
    if (location.link && location.link.includes('google.com/maps')) {
      allLocations.push({
        title: location.name,
        description: location.desc,
        link: location.link,
        type: 'explore',
        emoji: location.emojis ? location.emojis[0] : '📍'
      });
    }
  });

  // Add markers for each location using geocoding
  const bounds = new google.maps.LatLngBounds();
  let markersAdded = 0;
  
  allLocations.forEach((location, index) => {
    // Extract query from Google Maps link
    const query = extractCoordinatesFromLink(location.link);
    if (query) {
      geocodeLocation(query, (coords) => {
        if (coords) {
          const marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: location.title,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#4285F4" stroke="#fff" stroke-width="2"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="14" font-family="Arial">${location.emoji}</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            }
          });

          // Create info window content
          const infoContent = `
            <div style="max-width: 300px; padding: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #333;">${location.emoji} ${location.title}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; line-height: 1.4;">${location.description}</p>
              <a href="${location.link}" target="_blank" style="color: #4285F4; text-decoration: none; font-size: 14px;">📍 View on Google Maps</a>
            </div>
          `;

          const infoWindow = new google.maps.InfoWindow({
            content: infoContent
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          // Add to bounds
          bounds.extend(coords);
          markersAdded++;
          
          // Fit bounds when all markers are added
          if (markersAdded === allLocations.length) {
            map.fitBounds(bounds);
          }
        }
      });
    }
  });
}

function extractCoordinatesFromLink(link) {
  // Extract coordinates from Google Maps link
  // Format: https://www.google.com/maps/search/?api=1&query=...
  try {
    const url = new URL(link);
    const query = url.searchParams.get('query');
    if (query) {
      // Return the query string for geocoding
      return query;
    }
  } catch (e) {
    console.error('Error parsing coordinates from link:', e);
  }
  return null;
}

function geocodeLocation(query, callback) {
  if (!query) {
    callback(null);
    return;
  }
  
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: query }, (results, status) => {
    if (status === 'OK' && results[0]) {
      callback(results[0].geometry.location);
    } else {
      console.warn('Geocoding failed for:', query, 'Status:', status);
      callback(null);
    }
  });
} 