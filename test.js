function Circle(x, dx, y, dy, radius, color) {
  this.x = x;
  this.dx = dx;
  this.y = y;
  this.dy = dy;
  this.radius = radius;
  this.color = color;

  this.drawCircle = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.closePath();

    context.fillStyle = this.color;
    context.fill();

    context.strokeStyle = this.color;
    context.stroke();
  };

  this.circleUpdate = function () {
    if (this.x > innerWidth - 50 || this.x < 40) {
      this.dx = -this.dx;
    }
    if (this.y > innerHeight - 50 || this.y < 40) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.drawCircle();
  };
}

function Rect(x, y, height, width, color) {
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
  this.color = color;

  this.drawRect = function () {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);

    context.strokeStyle = this.color;
    context.strokeRect(this.x, this.y, this.width, this.height);
  };
}
