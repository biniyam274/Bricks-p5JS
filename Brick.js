class Brick {
  constructor(location, width, height, color) {
    this.location = location;
    this.width = width;
    this.height = height;
    this.color = color;
    this.points = 1;
  }

  display() {
    fill(this.color);
    rect(this.location.x, this.location.y, this.width, this.height);
  }

  colide(ball) {
    // Cheking if ball is touching all the edge of the brick
    if (
      ball.location.y - ball.radius <= this.location.y + this.height &&
      ball.location.y + ball.radius >= this.location.y &&
      ball.location.x + ball.radius >= this.location.x &&
      ball.location.x - ball.radius <= this.location.x + this.width
    ) {
      return true;
    }
  }
}
