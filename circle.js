import { GameObject } from "./GameObject.js";

export class Circle extends GameObject {
  constructor(x, dx, y, dy, radius, color, mass) {
    super();
    this.x = x;
    this.dx = dx;
    this.y = y;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.mass = mass;
    this.image = new Image()
    this.height = 25;
    this.width = 24;
    this.frame = 0;
    this.gameFrame = 0;
    this.staggerFrames = 5;
  }

  drawCircle(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();

    // ctx.fillStyle = this.color;
    // ctx.fill();

    // ctx.strokeStyle = this.color;
    // ctx.stroke();

    this.image.src = "./Assets/DuckAnimations/runAnimation.png"
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      this.image,
      0 + this.width * this.frame, 0,
      this.width, this.height,
      this.x - this.radius, this.y - this.radius,
      this.radius * 2, this.radius * 2,
    )

  }

  circleUpdate(context) {
    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.drawCircle(context);
    if (this.gameFrame % this.staggerFrames == 0) {
      if (this.frame < 5) this.frame++;
      else this.frame = 0;
    }
    this.gameFrame += 0.5;
  }
}
