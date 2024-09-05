import { GameObject } from "./GameObject.js";

export class Circle extends GameObject {
  constructor(x, dx, y, dy, radius, color) {
    super();
    this.x = x;
    this.dx = dx;
    this.y = y;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  drawCircle(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();

    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  circleUpdate(context) {
    if (this.x > innerWidth - 50 || this.x < 40) {
      this.dx = -this.dx;
    }
    if (this.y > innerHeight - 50 || this.y < 40) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.drawCircle(context);
  }
}
