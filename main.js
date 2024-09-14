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
  { title: 'YSY A - MAS GRANDE ESTE AÑO (Prod. CLUB HATS)', src: 'cansiones/9.mp3', img: 'fotos/9.jpg' },
  { title: 'YSY A - A POR TODO (PROD. ONIRIA)', src: 'cansiones/10.mp3', img: 'fotos/10.jpg' },
  { title: 'YSY A x BHAVI ft. TIAGO PZK - MI CIUDAD (PROD. ASAN)', src: 'cansiones/11.mp3', img: 'fotos/11.jpg' },
  { title: 'YSY A FT DUKI - NO DA MAS (PROD. ONIRIA FT. YESAN)', src: 'cansiones/12.mp3', img: 'fotos/12.jpg' }
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

function playSong() {
  audio.play();
  playPauseBtn.textContent = '∎';
  isPlaying = true;
}

function nextSong() {
  currentSongIndex = isShuffling ? Math.floor(Math.random() * songs.length) : (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong(); // Reproduce automáticamente la siguiente canción
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playSong(); // Reproduce automáticamente la canción anterior
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
      playSong(); // Reproduce automáticamente la canción seleccionada
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
      playSong(); // Reproduce automáticamente la canción filtrada
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

// Función para la transición suave entre canciones
function fadeOutInTransition(callback) {
  const fadeOutDuration = 2000; // 2 segundos para desvanecer
  const fadeInDuration = 2000;  // 2 segundos para aumentar volumen

  // Fade out: bajar volumen
  let fadeOutInterval = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume = Math.max(0, audio.volume - 0.05);
    } else {
      clearInterval(fadeOutInterval);
      callback(); // Cambiar a la siguiente canción
      fadeInTransition(fadeInDuration);
    }
  }, fadeOutDuration / 20);
}

// Función para aumentar el volumen gradualmente
function fadeInTransition(duration) {
  audio.volume = 0;  // Inicia en 0
  let fadeInInterval = setInterval(() => {
    if (audio.volume < 1) {
      audio.volume = Math.min(1, audio.volume + 0.05);
    } else {
      clearInterval(fadeInInterval);
    }
  }, duration / 20); // Controlar el incremento del volumen durante el fade-in
}

audio.addEventListener('ended', () => {
  fadeOutInTransition(nextSong); // Al terminar la canción, hacer la transición a la siguiente
});

progressBar.addEventListener('input', setProgress);

initPlayer();