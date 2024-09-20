import { awake, update } from "./index.js";
import * as audio from "./audio.js";
import { generateObstacle } from "./gameManager.js";

//UI
const audioOn = "./Assets/Icons/Icon_SoundOn.png"
const audioOff = "./Assets/Icons/Icon_SoundOff.png"

export const mainMenuUI = document.querySelector("#menuEl");
const mainMenuUI_playBtn = document.querySelector("#playBtn");
const mainMenuUI_optBtn = document.querySelector("#optBtn");
const mainMenuUI_exitBtn = document.querySelector("#exitBtn");

const optionUI = document.querySelector("#optionEl");
const optionUI_audioOtpBtn = document.querySelector("#audioOtpBtn");
const optionUI_audioSettingImage = document.querySelector("#audioSettingImage");
const optionUI_homeOtpBtn = document.querySelector("#homeOtpBtn");

// const settingUI = document.querySelector("#pauseEl");
// const settingUI_settingBtn = document.querySelector("#settingBtn");

// const pauseChildElUI = document.querySelector("#pauseChildEl");
// const pauseChildElUI_resumeBtn = document.querySelector("#resumeBtn");
// const pauseChildElUI_audioBtn = document.querySelector("#audioBtn");
// const pauseChildElUI_homeBtn = document.querySelector("#homeBtn");

//UI
mainMenuUI_playBtn.addEventListener("click", function () {
  awake();
  update();
  generateObstacle();
  mainMenuUI.style.display = "none";
  // settingUI.style.display = "flex";
  audio.backgroundTheme.currentTime = 0;
  audio.backgroundTheme.play()
  startTime = null;
  startPosition = innerHeight / 2;
  requestAnimationFrame(animate);
});

mainMenuUI_optBtn.addEventListener("click", function () {
  mainMenuUI.style.display = "none";
  optionUI.style.display = "flex";
});

mainMenuUI_exitBtn.addEventListener("click", function () {
  window.close();
});

var checkAudio = true;
optionUI_audioOtpBtn.addEventListener("click", function () {
  if (checkAudio) {
    audio.backgroundTheme.volume = 0;
    audio.duckTheme.volume = 0;
    audio.winTheme.volume = 0;
    optionUI_audioSettingImage.src = audioOff
    checkAudio = !checkAudio
  } else if (!checkAudio) {
    audio.backgroundTheme.volume = audio.backgroundThemeRegular;
    audio.duckTheme.volume = audio.duckThemeThemeRegular;
    audio.winTheme.volume = audio.winThemeThemeRegular;
    optionUI_audioSettingImage.src = audioOn
    checkAudio = !checkAudio
  }
})

optionUI_homeOtpBtn.addEventListener("click", function () {
  mainMenuUI.style.display = "flex";
  optionUI.style.display = "none";
})

// settingUI_settingBtn.addEventListener("click", function () {
//   pauseChildElUI.style.display = "flex";
//   window.cancelAnimationFrame(animationID)
// })

// pauseChildElUI_resumeBtn.addEventListener("click", function () {
//   window.requestAnimationFrame(animationID)
//   pauseChildElUI.style.display = "none";
// })

// pauseChildElUI_audioBtn.addEventListener("click", function () {
//   if (checkAudio) {
//     backgroundTheme.volume = 0;
//     duckTheme.volume = 0;
//     winTheme.volume = 0;
//     optionUI_audioSettingImage.src = audioOff
//     checkAudio = !checkAudio
//   } else if (!checkAudio) {
//     backgroundTheme.volume = backgroundThemeRegular;
//     duckTheme.volume = duckThemeThemeRegular;
//     winTheme.volume = winThemeThemeRegular;
//     optionUI_audioSettingImage.src = audioOn
//     checkAudio = !checkAudio
//   }
// })

//UI animation
function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

let startTime = null;
let startPosition = innerHeight / 2;

function animate(time) {
  if (!startTime) startTime = time;
  let progress = (time - startTime) / 3000;
  if (progress > 1) progress = 1;

  mainMenuUI.style.transform = `translateY(${startPosition - easeOutQuart(progress) * startPosition}px)`;

  if (progress < 1) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
