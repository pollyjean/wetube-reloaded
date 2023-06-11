import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const recorderContainer = document.getElementById("recorderContainer");
const recorderBtn = document.getElementById("recorderBtn");
const videoStreamingObj = document.getElementById("videoStreaming");
const timerRangeInput = document.getElementById("timerMinutes");
const recorderReloadBtn = document.getElementById("recorderReload");

/** 쿠키에 볼륨 집어넣기 */
const TIMER_IS = "timer=";
const getTimerCookie = () => document.cookie.split("; ").find(word => word.startsWith(TIMER_IS)).split("=")[1];

/** 변수들을 한군데 모음 */
const recorder = {
  stream: undefined,
  record: null,
  url: null,
  timer: (document.cookie.includes("timer=") ? getTimerCookie() : timerRangeInput.value)
}
const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
}

/** 레코딩 초기화
 * 퍼미션 거부하면
 * 1. 화면에 메시지 띄우고
 * 2. 버튼은 감춤
 * 3. 에러는 로그에 표시 */
const initRecorder = async () => {
  try {
    timerRangeInput.value = recorder.timer;
    recorder.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 1280,
        height: 720
      },
      audio: false
    });
    videoStreamingObj.srcObject = recorder.stream;
    videoStreamingObj.play();
  } catch (error) {
    const errorMessageElm = document.createElement("p");
    errorMessageElm.classList.add("error__message");
    errorMessageElm.innerText = "If you grant camera and microphone permissions, you can record video."
    recorderContainer.prepend(errorMessageElm);
    recorderBtn.style.display = "none";
    console.log("Error Message : ", error);
  }
};
const makeDownload = (fileUrl, fileName) => {
  const downLink = document.createElement("a");
  downLink.href = fileUrl;
  downLink.setAttribute("download", fileName);
  document.body.appendChild(downLink);
  downLink.click();
  document.querySelector(".btn__hidden").classList.add("showing");
}
const setBtnDisable = (state = true) => {
  recorderBtn.disabled = state;
  recorderBtn.ariaDisabled = state;
  timerRangeInput.disabled = state;
  state ? recorderBtn.classList.add("disable") : recorderBtn.classList.remove("disable");
}
const handleDownload = async () => {
  recorderBtn.removeEventListener("click", handleDownload);
  setBtnDisable(true);
  recorderBtn.querySelector("span").innerText = "Video Transcoding...";
  recorderBtn.querySelector("i").classList = "fas fa-dice-d6";
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  recorderBtn.querySelector("span").innerText = "Video Transcoding..";
  ffmpeg.FS("writeFile", files.input, await fetchFile(recorder.url));
  await ffmpeg.run("-i", files.input, "-r", "30", files.output);
  recorderBtn.querySelector("span").innerText = "Video Transcoding.";
  await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);

  const mp4File = ffmpeg.FS("readFile", files.output);
  const jpgFile = ffmpeg.FS("readFile", files.thumb);
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const jpgBlob = new Blob([jpgFile.buffer], { type: "image/jpg" });
  const mp4Url = URL.createObjectURL(mp4Blob);
  const jpgUrl = URL.createObjectURL(jpgBlob);

  /** 파일명 구분을 위해서 밀리세컨드 초 뒷부분을 잘라서 파일명 뒤에 넣음 */
  const dateNum = String(Date.now()).slice(-8);
  makeDownload(jpgUrl, `record_${dateNum}.jpg`);
  makeDownload(mp4Url, `record_${dateNum}.mp4`);

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(jpgUrl);

  initRecorder();
  recorderBtn.querySelector("span").innerText = "Retake Recording";
  recorderBtn.querySelector("i").className = "fas fa-camera";
  recorderBtn.addEventListener("click", handleStartRecording);
  setBtnDisable(false);
}
const handleStopRecording = () => {
  recorder.record.stop();
  setBtnDisable(false);
  recorderBtn.querySelector("span").innerText = "Download Recording";
  recorderBtn.querySelector("i").className = "fas fa-cloud-download-alt";
  recorderBtn.removeEventListener("click", handleStopRecording);
  recorderBtn.addEventListener("click", handleDownload);
}
/** 카운트다운(초) 1초씩 줄어드는 걸 버튼에 표시하고 0되면 레코딩 끝냄
 * 기본값은 10(초)
 */
const countRecording = (cnt = 10) => {
  let count = Number(cnt) + 1;
  recorderBtn.querySelector("span").innerText = `Count Recording...${count - 1}`;
  setBtnDisable(true);
  const timeout = setInterval(() => {
    count -= 1;
    recorderBtn.querySelector("span").innerText = `Count Recording...${count - 1}`;
    if (count === 0) {
      clearInterval(timeout);
      handleStopRecording();
    }
  }, 1000);
}
const handleStartRecording = () => {
  recorder.record = new MediaRecorder(recorder.stream);
  recorderBtn.removeEventListener("click", handleStartRecording);
  recorderBtn.addEventListener("click", handleStopRecording);
  document.querySelector(".btn__hidden").classList.remove("showing");
  recorder.record.ondataavailable = (event) => {
    recorder.url = URL.createObjectURL(event.data);
    videoStreamingObj.srcObject = null;
    videoStreamingObj.src = recorder.url;
    videoStreamingObj.loop = true;
    videoStreamingObj.play();
  };
  recorder.record.start();
  countRecording(recorder.timer);
}
const handleTimer = (event) => {
  recorder.timer = event.target.value;
  document.cookie = `${TIMER_IS}${event.target.value}`;

}

initRecorder();
recorderBtn.addEventListener("click", handleStartRecording);
timerRangeInput.addEventListener("change", handleTimer);
recorderReloadBtn.addEventListener("click", () => window.location.reload());
