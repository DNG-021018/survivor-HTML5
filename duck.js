import { GameObject } from "./GameObject.js";

export class Duck extends GameObject {
  constructor(x, dx, y, dy, radius, mass, context) {
    super();
    this.x = x;
    this.dx = dx;
    this.y = y;
    this.dy = dy;
    this.radius = radius;
    this.mass = mass;
    this.image = new Image()
    this.height = 25;
    this.width = 24;
    this.frame = 0;
    this.gameFrame = 0;
    this.staggerFrames = 5;
    this.context = context;
  }

  drawDuck() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.context.closePath();

    this.image.src = "./Assets/DuckAnimations/runAnimation.png"
    this.context.imageSmoothingEnabled = false;

    this.context.drawImage(
      this.image,
      0 + this.width * this.frame, 0,
      this.width, this.height,
      this.x - this.radius, this.y - this.radius,
      this.radius * 2, this.radius * 2,
    )
  }

  duckUpdate() {
    if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.drawDuck(this.context);
    if (this.gameFrame % this.staggerFrames == 0) {
      if (this.frame < 5) this.frame++;
      else this.frame = 0;
    }
    this.gameFrame += 0.5;
  }
}
