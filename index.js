import * as gameManager from "./gameManager.js"
import { updateCountdown, setStartingTime, setTime, setLastTime, setTimeElapsed } from "./timeManager.js";

("use strict");
//model
var canvas;
canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.background = "#c3c3c3";
var context;
context = canvas.getContext("2d");
var lengthObs = 50;
var timeAwake = 4000
var startingTime = 1;
var time = startingTime * 60;
var timeElapsed = 0;
var animationID;

export function getAnimationID() {
  return animationID
}

export function getContext() {
  return context
}

export function getLengthObs() {
  return lengthObs
}

export function awake() {
  gameManager.setArray([]);
  setStartingTime(startingTime);
  setTime(time);
  setLastTime(performance.now());
  setTimeElapsed(timeElapsed);
  setTimeout(() => {
    gameManager.createObstacle(lengthObs);
  }, timeAwake);
}

export function update() {
  animationID = window.requestAnimationFrame(update);
  context.clearRect(0, 0, innerWidth, innerHeight);
  gameManager.generateObstacle(context);
  gameManager.generatePlayer(context);
  updateCountdown(context);
}
