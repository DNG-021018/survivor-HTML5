import { Circle } from "./circle.js";
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
const playBtn = document.querySelector("#playBtn");
const gameoverUI = document.querySelector("#modalEl");

//obstacle
var circlesArray = [];
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
var timeAwake = 4000

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
    let cirX = Math.random() * (canvas.width - 2 * radiusObs) + radiusObs;
    let cirY = Math.random() * (canvas.height - 2 * radiusObs) + radiusObs;
    let dx = (Math.random() - 0.5) * speedObs;
    let dy = (Math.random() - 0.5) * speedObs;
    let radius = (Math.random() + 0.5) * radiusObs;
    let mass = radius;
    let color = getRandomColorHex();

    if (i != 0) {
      for (var j = 0; j < circlesArray.length; j++) {
        //check if obstacle overlap player
        //check if obstacle overlap each other
        if (getDistance(player.xPos, cirX, player.yPos, cirY) - (circlesArray[j].radius + player.radius) <= 10 ||
          getDistance(cirX, circlesArray[j].x, cirY, circlesArray[j].y) - (circlesArray[j].radius * 3) <= 0
        ) {
          cirX = Math.random() * (canvas.width - 2 * radiusObs) + radiusObs;
          cirY = Math.random() * (canvas.height - 2 * radiusObs) + radiusObs;
          j = -1;
        }
      }
    }
    circlesArray.push(new Circle(cirX, dx, cirY, dy, radius, color, mass));
  }
}

function generateObstacle() {
  for (var i = 0; i < circlesArray.length; i++) {
    circlesArray[i].circleUpdate(context);

    for (var j = i + 1; j < circlesArray.length; j++) {
      collisionPhysics(circlesArray[i], circlesArray[j])
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
      gameoverUI.style.display = "flex";
      cancelAnimationFrame(animationID);
    }
  });
}

//Collision
function getDistance(x1, x2, y1, y2) {
  let xDis = x2 - x1;
  let yDis = y2 - y1;
  let result = Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
  return result;
}
function collisionPhysics(obj1, obj2) {
  let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
  let distance = getDistance(obj1.x, obj2.x, obj1.y, obj2.y);

  // Nếu hai đối tượng không va chạm, không làm gì cả
  if (distance <= 0 || distance >= obj1.radius + obj2.radius) {
    return;
  }

  // Tính toán vCollisionNorm
  let vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };

  // Tính toán vận tốc tương đối
  let vRelativeVelocity = { x: obj1.dx - obj2.dx, y: obj1.dy - obj2.dy };
  let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

  if (speed <= 0) {
    return;
  }

  // Tính toán lực tác động (impulse)
  let impulse = 2 * speed / (obj1.mass + obj2.mass);

  // Điều chỉnh vận tốc của obj1 và obj2 sau va chạm
  obj1.dx -= (impulse * obj2.mass * vCollisionNorm.x);
  obj1.dy -= (impulse * obj2.mass * vCollisionNorm.y);
  obj2.dx += (impulse * obj1.mass * vCollisionNorm.x);
  obj2.dy += (impulse * obj1.mass * vCollisionNorm.y);

  // Điều chỉnh lại vị trí của obj1 và obj2 để không chồng lấn
  let overlap = 0.5 * (obj1.radius + obj2.radius - distance);
  obj1.x -= overlap * vCollisionNorm.x;
  obj1.y -= overlap * vCollisionNorm.y;
  obj2.x += overlap * vCollisionNorm.x;
  obj2.y += overlap * vCollisionNorm.y;
}

//UI
playBtn.addEventListener("click", function () {
  awake();
  update();
  generateObstacle();
  gameoverUI.style.display = "none";
});
