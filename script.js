const movies = [
  { title: 'Blade Runner 2049',     year: 2017, director: 'Denis Villeneuve',      genre: 'Sci-Fi',    emoji: '🌆', rating: '8.0', color: '#1a3a5c' },
  { title: 'Parasite',              year: 2019, director: 'Bong Joon-ho',           genre: 'Thriller',  emoji: '🏚️', rating: '8.5', color: '#2c3e1a' },
  { title: 'The Godfather',         year: 1972, director: 'Francis Ford Coppola',   genre: 'Crime',     emoji: '🌹', rating: '9.2', color: '#3b1a0e' },
  { title: 'Arrival',               year: 2016, director: 'Denis Villeneuve',       genre: 'Sci-Fi',    emoji: '🛸', rating: '7.9', color: '#0e1f2e' },
  { title: 'Spirited Away',         year: 2001, director: 'Hayao Miyazaki',         genre: 'Animation', emoji: '🐉', rating: '8.6', color: '#1c3a2e' },
  { title: 'Everything Everywhere', year: 2022, director: 'Daniels',               genre: 'Sci-Fi',    emoji: '🥯', rating: '7.8', color: '#3a1a3a' },
  { title: 'Chinatown',             year: 1974, director: 'Roman Polanski',         genre: 'Noir',      emoji: '🔍', rating: '8.1', color: '#1f1a0e' },
  { title: 'Oppenheimer',           year: 2023, director: 'Christopher Nolan',      genre: 'Drama',     emoji: '☢️', rating: '8.3', color: '#1a1209' },
  { title: 'Mulholland Drive',      year: 2001, director: 'David Lynch',            genre: 'Mystery',   emoji: '🌀', rating: '7.9', color: '#12103a' },
  { title: 'Mad Max: Fury Road',    year: 2015, director: 'George Miller',          genre: 'Action',    emoji: '🔥', rating: '8.1', color: '#3a1a08' },
  { title: 'Amélie',                year: 2001, director: 'Jean-Pierre Jeunet',     genre: 'Romance',   emoji: '🍒', rating: '8.3', color: '#3a2a08' },
  { title: 'No Country for Old Men',year: 2007, director: 'Coen Brothers',          genre: 'Crime',     emoji: '🪙', rating: '8.2', color: '#1a150a' },
  { title: 'Moonlight',             year: 2016, director: 'Barry Jenkins',          genre: 'Drama',     emoji: '🌙', rating: '7.4', color: '#081a2e' },
  { title: 'The Zone of Interest',  year: 2023, director: 'Jonathan Glazer',        genre: 'War',       emoji: '🌸', rating: '7.4', color: '#1a2a10' },
  { title: 'Alien',                 year: 1979, director: 'Ridley Scott',           genre: 'Horror',    emoji: '👾', rating: '8.4', color: '#0a1a0a' },
  { title: 'Past Lives',            year: 2023, director: 'Celine Song',            genre: 'Romance',   emoji: '🌊', rating: '7.8', color: '#0e1e2a' },
];
 
let currentSort = null;
const grid     = document.getElementById('grid');
const countEl  = document.getElementById('count');
const select   = document.getElementById('sort-select');
 
function getSorted(key) {
  const list = [...movies];
  switch (key) {
    case 'alpha-az':  return list.sort((a, b) => a.title.trim().localeCompare(b.title.trim()));
    case 'alpha-za':  return list.sort((a, b) => b.title.trim().localeCompare(a.title.trim()));
    case 'year-new':  return list.sort((a, b) => b.year - a.year);
    case 'year-old':  return list.sort((a, b) => a.year - b.year);
    default:          return list;
  }
}
 
function render(list) {
  grid.innerHTML = '';
  countEl.textContent = `${list.length} film${list.length !== 1 ? 's' : ''}`;
  list.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${i * 0.035}s`;
    card.innerHTML = `
      <div class="poster">
        <div class="poster-bg" style="background:radial-gradient(circle at 40% 40%, ${m.color}, #0d0d0f)"></div>
        <span class="poster-emoji">${m.emoji}</span>
        <span class="year-badge">${m.year}</span>
        <span class="genre-chip">${m.genre}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${m.title}</div>
        <div class="card-meta">
          <span class="card-director">${m.director}</span>
          <span class="card-rating">★ ${m.rating}</span>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}
 
function applySort(key) {
  currentSort = key;
  render(key ? getSorted(key) : movies);
}
 
select.addEventListener('change', () => applySort(select.value));
 
// Default render
render(movies);
countEl.textContent = `${movies.length} films`;