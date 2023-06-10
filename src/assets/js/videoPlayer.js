const videoContainer = document.getElementById("video__container")
const videoObj = document.querySelector("#video__container video");
const videoControls = document.getElementById("video__controller");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const timeCurrentTxt = document.getElementById("timeCurrent");
const timeDurationTxt = document.getElementById("timeDuration");
const timelineRange = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreen");
const videoCover = document.querySelector(".video__playCover");
const commentArea = document.getElementById("commentArea");

/** 쿠키에 볼륨 집어넣기 */
const VOLUME_IS = "volume=";
const getVolumeCookie = () => document.cookie.split("; ").find(word => word.startsWith(VOLUME_IS)).split("=")[1];

/** 변수들 모아두기 */
const videoStat = {
  volume: (document.cookie.includes("volume=") ? getVolumeCookie() : volumeRange.value),
  timerMouseMovement: null,
  timerMouseLeave: null,
}

/** 이벤트 핸들링
 * (대전제) 다른 이벤트 행동을 침해하지 않도록
 * 이벤트 행동을 미디어 오브젝트에 전달, 모양을 건드리지 않음
 * 뮤트볼륨에 관한 건, 레인지를 세팅하되, 전달은 볼륨에서
 */
const handlePlay = () => {
  videoObj.paused ? videoObj.play() : videoObj.pause();
  videoCover.remove();
}
const handlePlayCover = () => {
  handlePlay();
}
const handleMute = () => {
  if (videoObj.muted) {
    videoObj.muted = false;
    volumeRange.value = videoStat.volume;
  } else {
    videoObj.muted = true;
    videoStat.volume = volumeRange.value;
    volumeRange.value = 0;
  }
  handleVolume();
}
const handleVolume = () => {
  videoObj.volume = volumeRange.value;
  document.cookie = `${VOLUME_IS}${volumeRange.value}`;
}
const handleTimeline = () => {
  videoObj.currentTime = timelineRange.value;
  videoObj.pause();
}
const handelFullscreen = () => {
  document.fullscreenElement ? document.exitFullscreen() : videoContainer.requestFullscreen();
}
const hideVideoControls = () => videoControls.classList.remove("showing");
const handleMousemove = () => {
  if (videoStat.timerMouseLeave) {
    clearTimeout(videoStat.timerMouseLeave);
    videoStat.timerMouseLeave = null;
  }
  if (videoStat.timerMouseMovement) {
    clearTimeout(videoStat.timerMouseMovement);
    videoStat.timerMouseMovement = null;
  }
  videoControls.classList.add("showing");
  videoStat.timerMouseMovement = setTimeout(hideVideoControls, 3000);
}
const handleMouseleave = () => {
  videoStat.timerMouseLeave = setTimeout(hideVideoControls, 3000);
}
const handleKeyControl = (event) => {
  const { keyCode } = event;
  switch (keyCode) {
    case 32:
      event.preventDefault();
      handlePlay();
      break;
    case 70:
      document.fullscreenElement || videoContainer.requestFullscreen();
      break;
    case 27:
      document.fullscreenElement && document.exitFullscreen();
  }
}
const handleCommentFocusIn = () => {
  document.removeEventListener("keydown", handleKeyControl);
}

const handleCommentFocusOut = () => {
  document.addEventListener("keydown", handleKeyControl);
}

/** 이벤트 모니터링
 * 미디어 이벤트를 감시한다
 * 감시해서 각 버튼의 속성, 클래스, 텍스트에 접근해서 변경(Set) 한다
 */
const setPauseBtn = () => {
  playBtn.setAttribute("aria-label", "Play");
  playBtn.querySelector("i").className = "fas fa-play";
}
const setPlayBtn = () => {
  playBtn.setAttribute("aria-label", "Pause");
  playBtn.querySelector("i").className = "fas fa-pause";
}
const setMuteBtn = () => {
  const muted = (videoObj.volume === 0);
  muteBtn.setAttribute("aria-label", muted ? "Unmute" : "Mute");
  muteBtn.querySelector("i").className = `fas fa-volume-${muted ? "off" : "up"}`;
}
const getVideoCurrentTime = () => {
  timeCurrentTxt.innerText = getTimeFormat(videoObj.currentTime);
  timelineRange.value = videoObj.currentTime;
}
const getVideoMetaData = () => {
  timeDurationTxt.innerText = getTimeFormat(videoObj.duration);
  timelineRange.max = Math.floor(videoObj.duration);
}
const getTimeFormat = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);
const setFullscreenBtn = () => {
  const fullscreen = document.fullscreenElement;
  fullscreenBtn.setAttribute("aria-label", fullscreen ? "Exit Fullscreen" : "Enter Fullscreen");
  fullscreenBtn.querySelector("i").className = fullscreen ? "fas fa-compress" : "fas fa-expand";
}
const monitorPlayCount = async () => {
  const { dataset: { id } } = videoContainer;
  await fetch(`/api/videos/${id}/view`, { method: "POST" });
}

/** 마우스 이벤트 리스너
 * 마우스 이벤트 동작을 리스닝해서 비디오를 컨트롤한다
 */
playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
videoObj.addEventListener("click", handlePlay);
volumeRange.addEventListener("input", handleVolume);
timelineRange.addEventListener("input", handleTimeline);
fullscreenBtn.addEventListener("click", handelFullscreen);
videoContainer.addEventListener("mousemove", handleMousemove);
videoContainer.addEventListener("mouseleave", handleMouseleave);
videoCover.addEventListener("click", handlePlayCover);

document.addEventListener("keydown", handleKeyControl);
commentArea.addEventListener("focusin", handleCommentFocusIn);
commentArea.addEventListener("focusout", handleCommentFocusOut);

/** 비디오 이벤트 리스너
 * 비디오 상태를 리스닝해서 컨트롤을 변경
 */
videoObj.addEventListener("pause", setPauseBtn);
videoObj.addEventListener("play", setPlayBtn);
videoObj.addEventListener("volumechange", setMuteBtn);
videoObj.addEventListener("timeupdate", getVideoCurrentTime);
videoContainer.addEventListener("fullscreenchange", setFullscreenBtn);


/** 비디오 뷰 카운터 이벤트 View API */
videoObj.addEventListener("ended", monitorPlayCount);

/** 비디오 로딩이 지체되서 전체 시간을 못불러오는 현상 방지 */
(videoObj.readyState > 0) ? getVideoMetaData() : videoObj.addEventListener("loadedmetadata", getVideoMetaData);

/** 볼륨 초기화 */
volumeRange.value = videoStat.volume;
handleVolume();
