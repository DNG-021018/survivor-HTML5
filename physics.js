import { getContext } from "./index.js";
import { Duck } from "./duck.js";
import { getArray } from "./gameManager.js";

export function getDistance(x1, x2, y1, y2) {
    let xDis = x2 - x1;
    let yDis = y2 - y1;
    let result = Math.sqrt((xDis * xDis) + (yDis * yDis));
    return result;
}

export function collisionPhysics(obj1, obj2) {
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

export function mergeObj(obj1, obj2, array) {
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

export function splitObject(object) {
    const numberOfChildren = 4;
    let childRadius = (Math.random() + 0.8) * 30;
    const speed = 2;

    for (let i = 0; i < numberOfChildren; i++) {
        const angle = (i * (2 * Math.PI)) / numberOfChildren;
        const dx = speed * Math.cos(angle);
        const dy = speed * Math.sin(angle);

        const child = new Duck(object.x, dx, object.y, dy, childRadius, childRadius, getContext());
        getArray().push(child);
    }

    const index = getArray().indexOf(object);
    if (index > -1) {
        getArray().splice(index, 1);
    }
}