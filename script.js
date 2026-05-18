const API_KEY = '8d10bdd1';
const API_URL = 'https://www.omdbapi.com/';
 
let currentSort  = '';
let currentQuery = '';
let allResults   = [];
let searchTimer  = null;
 
const grid        = document.getElementById('grid');
const countEl     = document.getElementById('count');
const select      = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
 
// ── Fetch from OMDB ──────────────────────────────────────────
async function fetchMovies(query) {
  showLoading();
  try {
    const res  = await fetch(`${API_URL}?s=${encodeURIComponent(query)}&type=movie&apikey=${API_KEY}`);
    const data = await res.json();
 
    if (data.Response === 'True') {
      // Fetch full details for each result to get ratings & directors
      const detailed = await Promise.all(
        data.Search.map(m =>
          fetch(`${API_URL}?i=${m.imdbID}&apikey=${API_KEY}`).then(r => r.json())
        )
      );
      allResults = detailed.filter(m => m.Response === 'True');
      render(getSorted(allResults));
    } else {
      allResults = [];
      showMessage(`No results for "${query}"`);
      countEl.textContent = '0 films';
    }
  } catch (err) {
    showMessage('Failed to load results. Check your connection.');
    countEl.textContent = '';
  }
}
 
// ── Sort ─────────────────────────────────────────────────────
function getSorted(list) {
  const sorted = [...list];
  switch (currentSort) {
    case 'alpha-az': sorted.sort((a, b) => a.Title.localeCompare(b.Title)); break;
    case 'alpha-za': sorted.sort((a, b) => b.Title.localeCompare(a.Title)); break;
    case 'year-new': sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year)); break;
    case 'year-old': sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year)); break;
  }
  return sorted;
}
 
// ── Render cards ─────────────────────────────────────────────
function render(list) {
  grid.innerHTML = '';
  countEl.textContent = `${list.length} film${list.length !== 1 ? 's' : ''}`;
 
  list.forEach((m, i) => {
    const card      = document.createElement('div');
    card.className  = 'card';
    card.style.animationDelay = `${i * 0.04}s`;
 
    const hasPoster = m.Poster && m.Poster !== 'N/A';
    const rating    = m.imdbRating && m.imdbRating !== 'N/A' ? `★ ${m.imdbRating}` : '—';
    const genre     = m.Genre ? m.Genre.split(',')[0].trim() : '';
    const director  = m.Director && m.Director !== 'N/A' ? m.Director : 'Unknown';
 
    card.innerHTML = `
      <div class="poster">
        <div class="poster-bg" style="background: radial-gradient(circle at 40% 40%, #1a1a2e, #0d0d0f)"></div>
        ${hasPoster
          ? `<img src="${m.Poster}" alt="${m.Title} poster" loading="lazy"/>`
          : `<span class="poster-emoji">🎬</span>`
        }
        <span class="year-badge">${m.Year}</span>
        ${genre ? `<span class="genre-chip">${genre}</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-title">${m.Title}</div>
        <div class="card-meta">
          <span class="card-director">${director}</span>
          <span class="card-rating">${rating}</span>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}
 
// ── UI states ────────────────────────────────────────────────
function showLoading() {
  grid.innerHTML = `
    <div class="state-msg">
      <div class="spinner"></div>
      <div>Searching…</div>
    </div>`;
  countEl.textContent = '';
}
 
function showMessage(msg) {
  grid.innerHTML = `<div class="state-msg">${msg}</div>`;
}
 
function showDefault() {
  grid.innerHTML = `<div class="state-msg">Type a movie title above to search</div>`;
  countEl.textContent = '';
}
 
// ── Featured movies (loaded on home screen) ───────────────────
const FEATURED_IDS = [
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0468569', // The Dark Knight
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt2582802', // Whiplash
  'tt0137523', // Fight Club
  'tt0109830', // Forrest Gump
];
 
async function fetchFeatured() {
  showLoading();
  try {
    const results = await Promise.all(
      FEATURED_IDS.map(id =>
        fetch(`${API_URL}?i=${id}&apikey=${API_KEY}`).then(r => r.json())
      )
    );
    allResults = results.filter(m => m.Response === 'True');
    render(getSorted(allResults));
  } catch (err) {
    showDefault();
  }
}
 
// ── Events ───────────────────────────────────────────────────
searchInput.addEventListener('input', () => {
  currentQuery = searchInput.value.trim();
  searchClear.classList.toggle('visible', currentQuery.length > 0);
 
  clearTimeout(searchTimer);
  if (!currentQuery) {
    allResults = [];
    fetchFeatured();
    return;
  }
  // Debounce: wait 400ms after user stops typing
  searchTimer = setTimeout(() => fetchMovies(currentQuery), 400);
});
 
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  currentQuery = '';
  allResults   = [];
  searchClear.classList.remove('visible');
  searchInput.focus();
  fetchFeatured();
  countEl.textContent = '';
});
 
select.addEventListener('change', () => {
  currentSort = select.value;
  if (allResults.length) render(getSorted(allResults));
});
 
// ── Init ─────────────────────────────────────────────────────
fetchFeatured();