import { Circle } from "./circle.js";
import { Rect } from "./rect.js";

("use strict");
let canvas;
let context;
canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
context = canvas.getContext("2d");
window.onload = awake;
var circleArray = [];

// awake
function awake() {
  createObstacle();
}

//update
function update() {
  window.requestAnimationFrame(update);
  context.clearRect(0, 0, innerWidth, innerHeight);
  generateObstacle();
  generatePlayer();
}

//random color
function getRandomColorHex() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//generate Obstacle
function createObstacle() {
  for (var i = 0; i < 200; i++) {
    var cirX = Math.random() * innerWidth;
    var cirY = Math.random() * innerHeight;
    var dx = (Math.random() - 0.5) * 4;
    var dy = (Math.random() - 0.5) * 4;
    var radius = (Math.random() + 0.2) * 40;
    var color = getRandomColorHex();
    var circle = new Circle(cirX, dx, cirY, dy, radius, color);
    circleArray.push(circle);
  }
}

function generateObstacle() {
  for (var i = 0; i < circleArray.length; i++) {
    circleArray[i].circleUpdate(context);
  }
}

//generate Player
var player = {
  xPos: undefined,
  yPos: undefined,
  height: 80,
  width: 80,
  color: "black",
};

window.addEventListener("mousemove", function (event) {
  player.xPos = event.x;
  player.yPos = event.y;
});

function generatePlayer() {
  var rect = new Rect(
    player.xPos - player.height / 2,
    player.yPos - player.width / 2,
    player.height,
    player.width,
    player.color
  );
  rect.drawRect(context);
}

//Collider

update();
