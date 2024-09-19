import { Duck } from "./duck.js";
import { Player } from "./player.js";

("use strict");
//model
var canvas;
var context;
canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.background = "#c3c3c3";
context = canvas.getContext("2d");

//UI
const audioOn = "./Assets/Icons/Icon_SoundOn.png"
const audioOff = "./Assets/Icons/Icon_SoundOff.png"

const mainMenuUI = document.querySelector("#menuEl");
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

//audio
var backgroundTheme = new Audio()
backgroundTheme.src = "./Assets/music/theme.wav"
backgroundTheme.loop = true;
var backgroundThemeRegular = 0.1;
backgroundTheme.volume = backgroundThemeRegular;

var duckTheme = new Audio()
duckTheme.src = "./Assets/music/duck.m4a"
duckTheme.loop = false;
var duckThemeThemeRegular = 0.5;
duckTheme.volume = duckThemeThemeRegular;

var winTheme = new Audio()
winTheme.src = "./Assets/music/win.wav"
winTheme.loop = false;
var winThemeThemeRegular = 1;
winTheme.volume = winThemeThemeRegular;

//obstacle
var circlesArray = [];
var cirX;
var cirY;
var dx;
var dy;
var radius;
var mass;
var lengthObs = 50;
var speedObs = 3;
var radiusObs = 30;
var timeElapsed = 0;
var limitRadius = 100;

//player
var player = {
  radius: 10,
  xPos: innerWidth / 2,
  yPos: innerHeight / 2,
  color: undefined,
};

//time
var startingTime = 5;
var time = startingTime * 60;
var lastTime;
var timeAwake = 4000

// awake
function awake() {
  if (backgroundTheme == null || duckTheme == null) {
    console.log("cannot found the audio")
    return;
  }
  circlesArray = [];
  startingTime = 5;
  time = startingTime * 60;
  lastTime;
  lastTime = performance.now();
  timeElapsed = 0;
  player.color = "white";
  setTimeout(() => {
    createObstacle(lengthObs);
  }, timeAwake);
}

//update
var animationID;
function update() {
  animationID = window.requestAnimationFrame(update);
  context.clearRect(0, 0, innerWidth, innerHeight);
  generateObstacle();
  generatePlayer();
  updateCountdown();
}

//Countdown
function updateCountdown() {
  let currentTime = performance.now();
  let deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  time -= deltaTime;
  timeElapsed += deltaTime;

  // if time >= 10, boost speed obstacle
  if (timeElapsed >= 10) {
    circlesArray.forEach(function (circles) {
      circles.dx *= 1.11;
      circles.dy *= 1.11;
    });

    if (circlesArray.length <= lengthObs / 2) {
      createObstacle(Math.round(lengthObs / 2));
    }

    timeElapsed = 0;
  }

  if (time < 0) {
    time = 0;
    window.location.reload();
  }

  let seconds = Math.floor(time % 60);
  let minutes = Math.floor(time / 60);
  seconds = seconds < 10 ? "0" + seconds : seconds;

  context.font = "bold 50px Arial";
  context.fillStyle = "black";
  context.fillText(
    `${minutes} : ${seconds}`,
    innerWidth / 20,
    innerHeight / 12
  );

  if (minutes <= 0 && seconds <= 0) {
    mainMenuUI.style.display = "flex";
    cancelAnimationFrame(animationID);
    backgroundTheme.pause()
    winTheme.currentTime = 0
    winTheme.play()
  }
}

//generate Obstacle
function createObstacle(length) {
  for (var i = 0; i < length; i++) {
    cirX = Math.random() * (canvas.width - 2 * radiusObs) + radiusObs;
    cirY = Math.random() * (canvas.height - 2 * radiusObs) + radiusObs;
    dx = (Math.random() - 0.5) * speedObs;
    dy = (Math.random() - 0.5) * speedObs;
    radius = (Math.random() + 0.8) * radiusObs;
    mass = radius;

    if (i != 0) {
      for (var j = 0; j < circlesArray.length; j++) {
        //check if obstacle overlap player
        //check if obstacle overlap each other
        if (getDistance(player.xPos, cirX, player.yPos, cirY) - (circlesArray[j].radius + player.radius) <= 10 ||
          getDistance(cirX, circlesArray[j].x, cirY, circlesArray[j].y) - (circlesArray[j].radius * 3) <= 0) {
          cirX = Math.random() * (canvas.width - 2 * radiusObs) + radiusObs;
          cirY = Math.random() * (canvas.height - 2 * radiusObs) + radiusObs;
          j = -1;
        }
      }
    }
    circlesArray.push(new Duck(cirX, dx, cirY, dy, radius, mass));
  }
}

function generateObstacle() {
  for (var i = 0; i < circlesArray.length; i++) {
    circlesArray[i].circleUpdate(context);

    if (circlesArray[i].radius >= limitRadius) {
      splitObject(circlesArray[i]);
    }

    for (var j = i + 1; j < circlesArray.length; j++) {
      collisionPhysics(circlesArray[i], circlesArray[j])

      let isMerge = Math.random() < 0.2 ? true : false;
      if (isMerge) {
        mergeObj(circlesArray[i], circlesArray[j], circlesArray);
      }
    }
  }
}

//generate Player
window.addEventListener("mousemove", function (event) {
  player.xPos = event.x - player.radius / 2;
  player.yPos = event.y - player.radius / 2;
});

function generatePlayer() {
  let rect = new Player(player.xPos, player.yPos, player.radius, player.color);

  rect.drawPlayer(context);

  circlesArray.forEach(function (circles) {
    if (getDistance(player.xPos, circles.x, player.yPos, circles.y) <= circles.radius + player.radius) {
      rect.isColliding = true;
    }

    if (rect.isColliding) {
      backgroundTheme.pause()
      duckTheme.currentTime = 0;
      duckTheme.play();
      mainMenuUI.style.display = "flex";
      cancelAnimationFrame(animationID);
    }
  });
}

//Collision
function getDistance(x1, x2, y1, y2) {
  let xDis = x2 - x1;
  let yDis = y2 - y1;
  let result = Math.sqrt((xDis * xDis) + (yDis * yDis));
  return result;
}

function collisionPhysics(obj1, obj2) {
  let vCollision = {
    x: obj2.x - obj1.x,
    y: obj2.y - obj1.y
  };
  let distance = getDistance(obj1.x, obj2.x, obj1.y, obj2.y);
  let vCollisionNorm = {
    x: vCollision.x / distance,
    y: vCollision.y / distance
  };
  let vRelativeVelocity = {
    x: obj1.dx - obj2.dx,
    y: obj1.dy - obj2.dy
  };
  let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

  // no collision no event
  if (distance <= 0 || distance >= obj1.radius + obj2.radius) {
    return;
  }

  if (speed <= 0) {
    return;
  }

  let impulse = 2 * speed / (obj1.mass + obj2.mass);
  // adjust speed of obj1 and obj2 after collided
  obj1.dx -= (impulse * obj2.mass * vCollisionNorm.x);
  obj1.dy -= (impulse * obj2.mass * vCollisionNorm.y);
  obj2.dx += (impulse * obj1.mass * vCollisionNorm.x);
  obj2.dy += (impulse * obj1.mass * vCollisionNorm.y);

  //check if obstacle overlap each other
  let overlap = 0.5 * (obj1.radius + obj2.radius - distance);
  obj1.x -= overlap * vCollisionNorm.x;
  obj1.y -= overlap * vCollisionNorm.y;
  obj2.x += overlap * vCollisionNorm.x;
  obj2.y += overlap * vCollisionNorm.y;
}

function mergeObj(obj1, obj2, array) {
  if (obj1.radius == obj2.radius) return;

  if (getDistance(obj1.x, obj2.x, obj1.y, obj2.y) <= obj1.radius + obj2.radius) {
    if (obj1.radius > obj2.radius) {
      obj1.radius += 10;
      obj1.mass = obj1.radius
      let index = array.indexOf(obj2)
      array.splice(index, 1);

    } else if (obj1.radius < obj2.radius) {
      obj2.radius += 10;
      obj2.mass = obj2.radius
      let index = array.indexOf(obj1)
      array.splice(index, 1);
    }
  }
}

function splitObject(object) {
  const numberOfChildren = 4;
  let childRadius = (Math.random() + 0.8) * radiusObs;
  const speed = 2;

  for (let i = 0; i < numberOfChildren; i++) {
    const angle = (i * (2 * Math.PI)) / numberOfChildren;
    const dx = speed * Math.cos(angle);
    const dy = speed * Math.sin(angle);

    const child = new Duck(object.x, dx, object.y, dy, childRadius, childRadius);
    circlesArray.push(child);
  }

  const index = circlesArray.indexOf(object);
  if (index > -1) {
    circlesArray.splice(index, 1);
  }
}

//UI
mainMenuUI_playBtn.addEventListener("click", function () {
  awake();
  update();
  generateObstacle();
  mainMenuUI.style.display = "none";
  // settingUI.style.display = "flex";
  backgroundTheme.currentTime = 0;
  backgroundTheme.play()
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
    backgroundTheme.volume = 0;
    duckTheme.volume = 0;
    winTheme.volume = 0;
    optionUI_audioSettingImage.src = audioOff
    checkAudio = !checkAudio
  } else if (!checkAudio) {
    backgroundTheme.volume = backgroundThemeRegular;
    duckTheme.volume = duckThemeThemeRegular;
    winTheme.volume = winThemeThemeRegular;
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