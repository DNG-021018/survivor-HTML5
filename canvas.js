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
const gameoverUI = document.querySelector("#modalEl");

//obstacle
let circlesArray = [];
var lengthObs = 50;
var speedObs = 3;
var radiusObs = 30;
var timeElapsed = 0;

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
var timeAwake = 1

// awake
function awake() {
  circlesArray = [];
  startingTime = 5;
  time = startingTime * 60;
  lastTime;
  lastTime = performance.now();
  timeElapsed = 0;
  player.color = "white";
  setTimeout(() => {
    createObstacle();
  }, timeAwake);
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
    gameoverUI.style.display = "flex";
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

    if (i != 0) {
      for (var j = 0; j < circlesArray.length; j++) {
        //check if obstacle overlap player
        //check if obstacle overlap each other
        if (getDistance(player.xPos, cirX, player.yPos, cirY) - (circlesArray[j].radius + player.radius) <= 10 ||
          getDistance(cirX, circlesArray[j].x, cirY, circlesArray[j].y) - (circlesArray[j].radius * 3) <= 0) {
          cirX = Math.random() * canvas.width;
          cirY = Math.random() * canvas.height;
          j = -1;
        }
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
    if (getDistance(player.xPos, circles.x, player.yPos, circles.y) <= circles.radius + player.radius) {
      rect.isColliding = true;
    }

    if (rect.isColliding) {
      gameoverUI.style.display = "flex";
      cancelAnimationFrame(animationID);
    }
  });
}

//Collision
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
  gameoverUI.style.display = "none";
});
