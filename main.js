const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev-song');
const nextBtn = document.getElementById('next-song');
const volumeControl = document.getElementById('volume');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const songTitle = document.getElementById('song-title');
const songImg = document.getElementById('song-img');
const progressBar = document.getElementById('progress-bar');
const timeDisplay = document.getElementById('time-display');
const menuButton = document.getElementById('menu-button');
const songListMenu = document.getElementById('song-list-menu');
const songList = document.getElementById('song-list');
const searchBar = document.getElementById('search-bar');
const welcomeScreen = document.getElementById('welcome-screen'); // Elemento de bienvenida

let isPlaying = false;
let isShuffling = false;
let isRepeating = false;

const songs = [
  { title: 'FE!N Travis Scott', src: 'cansiones/1.mp3', img: 'fotos/1.jpg' },
  { title: 'Drake jimmy cooks ft 21 savege', src: 'cansiones/2.mp3', img: 'fotos/2.jpg' },
  { title: 'Polo G - Go Stupip', src: 'cansiones/3.mp3', img: 'fotos/3.jpg' },
  { title: 'Travis Scott - BUTTERFLY EFFECT', src: 'cansiones/4.mp3', img: 'fotos/4.jpg' },
  { title: 'Travis scott - MY EYES', src: 'cansiones/5.mp3', img: 'fotos/5.jpg' },
  { title: 'Nightcrawler travis scott', src: 'cansiones/6.mp3', img: 'fotos/6.jpg' },
  { title: 'Travis Scott - TIL FURTHER NOTICE ft. James Blake_ 21 Savage', src: 'cansiones/7.mp3', img: 'fotos/7.jpg' },
  { title: 'Travis Scott - HIGHEST IN THE ROOM.mp3', src: 'cansiones/8.mp3', img: 'fotos/8.jpg' },
    { title: 'Canción 10', src: 'cansiones/8.mp3', img: 'fotos/8.jpg' },
    { title: 'Canción 11', src: 'cansiones/8.mp3', img: 'fotos/8.jpg' },
    { title: 'Canción 12', src: 'cansiones/8.mp3', img: 'fotos/8.jpg' },
    { title: 'Canción 13', src: 'cansiones/8.mp3', img: 'fotos/13.jpg' }
];

let currentSongIndex = 0;

function loadSong(songIndex) {
  const song = songs[songIndex];
  audio.src = song.src;
  songTitle.textContent = song.title;
  songImg.src = song.img;
  songImg.setAttribute('loading', 'lazy'); // Cargar imágenes de manera perezosa
  progressBar.value = 0;
  updateProgress();
}

function playPause() {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = '▶';
  } else {
    audio.play();
    playPauseBtn.textContent = '∎';
  }
  isPlaying = !isPlaying;
}

function nextSong() {
  currentSongIndex = isShuffling ? Math.floor(Math.random() * songs.length) : (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playPause();
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playPause();
}

function toggleShuffle() {
  isShuffling = !isShuffling;
  shuffleBtn.classList.toggle('active', isShuffling);
}

function toggleRepeat() {
  isRepeating = !isRepeating;
  repeatBtn.classList.toggle('active', isRepeating);
  audio.loop = isRepeating;
}

function updateProgress() {
  progressBar.max = audio.duration || 0;
  progressBar.value = audio.currentTime;
  let minutes = Math.floor(audio.currentTime / 60);
  let seconds = Math.floor(audio.currentTime % 60);
  let totalMinutes = Math.floor((audio.duration || 0) / 60);
  let totalSeconds = Math.floor((audio.duration || 0) % 60);

  timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} / ${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
}

function setProgress() {
  audio.currentTime = progressBar.value;
}

function toggleMenu() {
  songListMenu.classList.toggle('visible');
  if (songListMenu.classList.contains('visible')) {
    songListMenu.style.display = 'block';
  } else {
    setTimeout(() => {
      songListMenu.style.display = 'none';
    }, 300);
  }
}

function updateSongList() {
  songList.innerHTML = ''; 
  songs.forEach((song, index) => {
    const songItem = document.createElement('div');
    songItem.classList.add('song-item');
    songItem.textContent = song.title;
    songItem.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(index);
      playPause();
      toggleMenu(); 
    });
    songList.appendChild(songItem);
  });
}

function debounce(func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}

const filterSongs = debounce(() => {
  const query = searchBar.value.toLowerCase();
  const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(query));
  songList.innerHTML = ''; 
  filteredSongs.forEach((song, index) => {
    const songItem = document.createElement('div');
    songItem.classList.add('song-item');
    songItem.textContent = song.title;
    songItem.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(index);
      playPause();
      toggleMenu();
    });
    songList.appendChild(songItem);
  });
}, 300);

function initPlayer() {
  loadSong(currentSongIndex);
  updateSongList();
  searchBar.addEventListener('input', filterSongs);
  songListMenu.style.display = 'none'; // Escondemos el menú de canciones al iniciar
}

// Ocultar la pantalla de bienvenida después de 3 segundos
window.addEventListener('load', () => {
  setTimeout(() => {
    welcomeScreen.style.display = 'none'; // Quitar la pantalla de bienvenida
  }, 3000); // 3 segundos
});

menuButton.addEventListener('click', toggleMenu);

playPauseBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
volumeControl.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});
audio.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('input', setProgress);
audio.addEventListener('ended', nextSong);

initPlayer();