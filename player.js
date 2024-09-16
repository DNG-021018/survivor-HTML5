import { GameObject } from "./GameObject.js";

export class Player extends GameObject {
  constructor(x, y, radius, color) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  drawPlayer(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();

    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.strokeStyle = "Black";
    ctx.stroke();

  }
}
