import { Circle } from "./circle.js";
import { Player } from "./player.js";

("use strict");
//model
let canvas;
let context;
canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight - 3.1;
canvas.style.background = "#c3c3c3";
context = canvas.getContext("2d");
const playBtn = document.querySelector("#playBtn");
const modalEl = document.querySelector("#modalEl");

//obstacle
let circlesArray = [];
var lengthObs = 5;
var speedObs = 3;
var radiusObs = 30;
var timeElapsed = 0; // Biến để theo dõi thời gian trôi qua

//player
var player = {
  radius: 10,
  xPos: innerWidth / 2,
  yPos: innerHeight / 2,
  color: "white",
};

//time
var startingTime = 5;
var time = startingTime * 60;
var lastTime;

// awake
function awake() {
  circlesArray = [];
  startingTime = 5;
  time = startingTime * 60;
  lastTime;
  lastTime = performance.now();
  timeElapsed = 0; // Đặt lại biến đếm thời gian
  player.color = "white";
  setTimeout(() => {
    createObstacle();
  }, 4000);
}

//update
let animationID;
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

  if (timeElapsed >= 10) {
    circlesArray.forEach(function (circles) {
      circles.dx *= 1.11;
      circles.dy *= 1.11;
    });
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
    modalEl.style.display = "flex";
    cancelAnimationFrame(animationID);
  }
}

//random color
function getRandomColorHex() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    if (color != player.color || color != canvas.style.background) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  }
  return color;
}

//generate Obstacle
function createObstacle() {
  for (var i = 0; i < lengthObs; i++) {
    var cirX = Math.random() * canvas.width;
    var cirY = Math.random() * canvas.height;
    var dx = (Math.random() - 0.5) * speedObs;
    var dy = (Math.random() - 0.5) * speedObs;
    var radius = (Math.random() + 0.5) * radiusObs;
    var color = getRandomColorHex();

    for (var j = 0; j < circlesArray.length; j++) {
      if (
        getDistance(
          player.xPos,
          circlesArray[j].x,
          player.yPos,
          circlesArray[j].y
        ) -
          circlesArray[j].radius +
          player.radius <=
        2
      ) {
        cirX = Math.random() * canvas.width;
        cirY = Math.random() * canvas.height;
      }
    }

    circlesArray.push(new Circle(cirX, dx, cirY, dy, radius, color));
  }
}

function generateObstacle() {
  for (var i = 0; i < circlesArray.length; i++) {
    circlesArray[i].circleUpdate(context);
  }
}

//generate Player
window.addEventListener("mousemove", function (event) {
  player.xPos = event.x - player.radius / 2;
  player.yPos = event.y - player.radius / 2;
});

function generatePlayer() {
  var rect = new Player(player.xPos, player.yPos, player.radius, player.color);

  rect.drawPlayer(context);

  circlesArray.forEach(function (circles) {
    if (
      getDistance(player.xPos, circles.x, player.yPos, circles.y) <=
      circles.radius + player.radius
    ) {
      rect.isColliding = true;
    }

    if (rect.isColliding) {
      modalEl.style.display = "flex";
      cancelAnimationFrame(animationID);
    }
  });
}

//Collider
function getDistance(x1, x2, y1, y2) {
  var xDis = x2 - x1;
  var yDis = y2 - y1;
  var result = Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
  return result;
}

//UI
playBtn.addEventListener("click", function () {
  awake();
  update();
  generateObstacle();
  modalEl.style.display = "none";
});
