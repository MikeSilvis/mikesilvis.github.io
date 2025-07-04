// Show loading message
document.getElementById('itineraryList').innerHTML = '<li>Loading itinerary...</li>';
document.getElementById('exploreGrid').innerHTML = '<div>Loading explore data...</div>';

// Use the JSON file specified by the HTML page
const tripJsonFile = window.TRIP_JSON || '';
const jsonPath = '../plans/' + tripJsonFile;

fetch(jsonPath)
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(tripData => {
    // Set header title and subtitle
    if (tripData.title) document.getElementById('tripTitle').textContent = tripData.title;
    if (tripData.subtitle) document.getElementById('tripSubtitle').textContent = tripData.subtitle;

    // Get unique emojis for filters
    const uniqueEmojis = Array.from(new Set(tripData.explore.flatMap(f => f.emojis)));

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
      tripData.explore.filter(f => emoji === 'all' || f.emojis.includes(emoji)).forEach(f => {
        grid.innerHTML += `<div class="food-card"><span class="emoji">${f.emojis.join(' ')}</span> <span class="name">${f.name}</span><div class="desc">${f.desc}</div><div><a href='${f.link}' target='_blank' title='${f.linkText}' style='margin-top:4px;display:inline-block;font-size:0.98rem;color:var(--blue);text-decoration:underline;'>${f.linkText}</a></div></div>`;
      });
    }
    // Initial render
    filterExplore('all');

    // Scrollspy functionality
    const sections = [
      {id: 'itinerary', nav: 'nav-itinerary'},
      {id: 'explore', nav: 'nav-explore'}
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
                  return `<div class='itinerary-event'>${opt.desc}</div>`;
                }).join('') +
              `</div>` +
            `</div>`;
          }).join('');
        }
        list.appendChild(li);
      });
    }
    renderItinerary(tripData.itinerary, 'itineraryList');
  })
  .catch(err => {
    document.getElementById('itineraryList').innerHTML = '<li>Error loading itinerary.</li>';
    document.getElementById('exploreGrid').innerHTML = '<div>Error loading explore data.</div>';
  }); 