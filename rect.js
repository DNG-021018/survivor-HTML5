import { GameObject } from "./GameObject.js";

export class Rect extends GameObject {
  constructor(x, y, height, width, color) {
    super();
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.color = color;
  }

  drawRect(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
