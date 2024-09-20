import { getArray, createObstacle } from "./gameManager.js";
import { getAnimationID, getLengthObs } from "./index.js";
import { mainMenuUI } from "./gameUI.js";
import * as audio from "./audio.js"

var startingTime;
var time;
var lastTime;
var timeElapsed;

//setter
export function setStartingTime(newStartingTime) {
    startingTime = newStartingTime;
    time = startingTime;
}

export function setTime(newTime) {
    time = newTime;
}

// Setter cho lastTime
export function setLastTime(newLastTime) {
    lastTime = newLastTime;
}

export function setTimeElapsed(newTimeElapsed) {
    timeElapsed = newTimeElapsed;
}

//Countdown
export function updateCountdown(context) {
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastTime) / 500;
    lastTime = currentTime;
    time -= deltaTime;
    timeElapsed += deltaTime;

    // if time >= 10s, boost speed obstacle
    if (timeElapsed >= 10) {
        getArray().forEach(function (circles) {
            circles.dx *= 1.11;
            circles.dy *= 1.11;
        });

        // instance obstacle after 10s
        if (getArray().length <= getLengthObs() / 2) {
            createObstacle(Math.round(getLengthObs() / 2));
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
        cancelAnimationFrame(getAnimationID());
        audio.backgroundTheme.pause()
        audio.winTheme.currentTime = 0
        audio.winTheme.play()
    }
}