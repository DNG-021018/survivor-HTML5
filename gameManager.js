import { Duck } from "./duck.js";
import { Player } from "./player.js";
import * as audio from "./audio.js";
import { mainMenuUI } from "./gameUI.js";
import * as physics from "./physics.js";
import { getAnimationID, getContext } from "./index.js";

//obstacle
export var duckArray = [];
var cirX;
var cirY;
var dx;
var dy;
var radius;
var mass;
var speedObs = 3;
var radiusObs = 30;
var limitRadius = 100;

//player
var player = {
    radius: 10,
    xPos: innerWidth / 2,
    yPos: innerHeight / 2,
    color: "white",
};

// setter
export function setArray(newArray) {
    duckArray = newArray;
}

export function getArray() {
    return duckArray;
}

//generate Obstacle
export function createObstacle(length) {
    for (var i = 0; i < length; i++) {
        cirX = Math.random() * (canvas.width - 2 * radiusObs) + radiusObs;
        cirY = Math.random() * (canvas.height - 2 * radiusObs) + radiusObs;
        dx = (Math.random() - 0.5) * speedObs;
        dy = (Math.random() - 0.5) * speedObs;
        radius = (Math.random() + 0.8) * radiusObs;
        mass = radius;

        if (i != 0) {
            for (var j = 0; j < duckArray.length; j++) {
                //check if obstacle overlap player
                //check if obstacle overlap each other
                if (physics.getDistance(player.xPos, cirX, player.yPos, cirY) - (duckArray[j].radius + player.radius) <= 10 ||
                    physics.getDistance(cirX, duckArray[j].x, cirY, duckArray[j].y) - (duckArray[j].radius * 3) <= 0) {
                    cirX = Math.random() * (canvas.width - 2 * radiusObs) + radiusObs;
                    cirY = Math.random() * (canvas.height - 2 * radiusObs) + radiusObs;
                    j = -1;
                }
            }
        }
        duckArray.push(new Duck(cirX, dx, cirY, dy, radius, mass, getContext()));
    }
}

export function generateObstacle(context) {
    for (var i = 0; i < duckArray.length; i++) {
        duckArray[i].duckUpdate();
        // if obstacle to big, it will split 
        if (duckArray[i].radius >= limitRadius) {
            physics.splitObject(duckArray[i]);
        }

        for (var j = i + 1; j < duckArray.length; j++) {
            physics.collisionPhysics(duckArray[i], duckArray[j])

            let isMerge = Math.random() < 0.2 ? true : false;
            if (isMerge) {
                physics.mergeObj(duckArray[i], duckArray[j], duckArray);
            }
        }
    }
}

//generate Player
window.addEventListener("mousemove", function (event) {
    player.xPos = event.x - player.radius / 2;
    player.yPos = event.y - player.radius / 2;
});

export function generatePlayer(context) {
    let rect = new Player(player.xPos, player.yPos, player.radius, player.color);
    rect.drawPlayer(context);

    duckArray.forEach(function (circles) {
        if (physics.getDistance(player.xPos, circles.x, player.yPos, circles.y) <= circles.radius + player.radius) {
            rect.isColliding = true;
        }

        if (rect.isColliding) {
            audio.backgroundTheme.pause()
            audio.duckTheme.currentTime = 0;
            audio.duckTheme.play();
            mainMenuUI.style.display = "flex";
            cancelAnimationFrame(getAnimationID());
        }
    });
}