const videoContainer = document.getElementById("video__container")
const videoObj = document.querySelector("#video__container video");
const videoControls = document.getElementById("video__controller");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const timeDurationTxt = document.getElementById("timeDuration");
const timeTotalTxt = document.getElementById("timeTotal");
const timelineRange = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreen");

let volumeLevel = volumeRange.value;

const handlePlayClick = () => {
  videoObj.paused ? videoObj.play() : videoObj.pause();
}
const handlePause = () => {
  playBtn.setAttribute("aria-label", "Play");
  playBtn.querySelector("i").classList.add("fa-play");
  playBtn.querySelector("i").classList.remove("fa-pause");
}
const handlePlay = () => {
  playBtn.setAttribute("aria-label", "Pause");
  playBtn.querySelector("i").classList.add("fa-pause");
  playBtn.querySelector("i").classList.remove("fa-play");
}
const handleMute = () => {
  if (videoObj.mute) {
    videoObj.mute = false;
    videoObj.volume = volumeLevel;
    muteBtn.setAttribute("aria-label", "Mute");
    muteBtn.querySelector("i").classList.add("fa-volume-up");
    muteBtn.querySelector("i").classList.remove("fa-volume-off");
  } else {
    videoObj.mute = true;
    volumeLevel = videoObj.volume;
    videoObj.volume = 0
    muteBtn.setAttribute("aria-label", "Unmute");
    muteBtn.querySelector("i").classList.add("fa-volume-off");
    muteBtn.querySelector("i").classList.remove("fa-volume-up");
  }
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
videoObj.addEventListener("pause", handlePause);
videoObj.addEventListener("play", handlePlay);