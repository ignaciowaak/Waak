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
const dynamicBackground = document.getElementById('dynamic-background');

let isPlaying = false;
let isShuffling = false;
let isRepeating = false;

const songs = [
  { title: 'FE!N Travis Scott', src: 'cansiones/1.mp3', img: 'fotos/1.jpg' },
  { title: 'Drake jmmy cooks ft 21 savege', src: 'cansiones/2.mp3', img: 'fotos/2.jpg' },
  { title: 'Polo G - Go Stupip.mp3 ', src: 'cansiones/3.mp3', img: 'fotos/3.jpg' },
  { title: 'Canción 4', src: 'cansiones/4.mp3', img: 'fotos/4.jpg' },
  { title: 'Canción 5', src: 'cansiones/5.mp3', img: 'fotos/5.jpg' },
  { title: 'Canción 6', src: 'cansiones/6.mp3', img: 'fotos/6.jpg' },
  { title: 'Canción 7', src: 'cansiones/7.mp3', img: 'fotos/7.jpg' },
  { title: 'Canción 8', src: 'cansiones/8.mp3', img: 'fotos/8.jpg' }


];

let currentSongIndex = 0;
let audioContext, analyser, dataArray, bufferLength;

function loadSong(songIndex) {
  const song = songs[songIndex];
  audio.src = song.src;
  songTitle.textContent = song.title;
  songImg.src = song.img;
  progressBar.value = 0;
  updateProgress();
}

function playPause() {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = '▶️';
  } else {
    audio.play();
    playPauseBtn.textContent = '⏸️';
  }
  isPlaying = !isPlaying;

  if (!audioContext) {
    initAudioAnalyzer();
  }
}

function nextSong() {
  if (isShuffling) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
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
  progressBar.max = audio.duration;
  progressBar.value = audio.currentTime;
  let minutes = Math.floor(audio.currentTime / 60);
  let seconds = Math.floor(audio.currentTime % 60);
  let totalMinutes = Math.floor(audio.duration / 60);
  let totalSeconds = Math.floor(audio.duration % 60);

  timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} / ${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
}

function setProgress() {
  audio.currentTime = progressBar.value;
}

function initAudioAnalyzer() {
  audioContext = new(window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  analyser.fftSize = 256;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  animateBackground();
}

function animateBackground() {
  analyser.getByteFrequencyData(dataArray);

  let lowFrequencyAverage = 0;
  for (let i = 0; i < bufferLength / 2; i++) {
    lowFrequencyAverage += dataArray[i];
  }
  lowFrequencyAverage = lowFrequencyAverage / (bufferLength / 2);

  // Cambia el fondo de acuerdo a la intensidad
  const intensity = lowFrequencyAverage / 255;
  const speed = 1 + intensity * 2;
  const colorChangeSpeed = 400 - intensity * 300;

  dynamicBackground.style.backgroundPosition = `${Math.sin(audio.currentTime * speed) * 50 + 50}% ${Math.cos(audio.currentTime * speed) * 50 + 50}%`;

  // Cambio de colores basado en la intensidad de la música
  const color1 = `hsl(${Math.random() * 360}, 100%, ${50 + intensity * 30}%)`;
  const color2 = `hsl(${Math.random() * 360}, 100%, ${50 + intensity * 30}%)`;

  dynamicBackground.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;

  requestAnimationFrame(animateBackground);
}

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

audio.addEventListener('ended', () => {
  if (!isRepeating) nextSong();
});

// Cargar la primera canción
loadSong(currentSongIndex);