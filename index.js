// Selectors
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.width = 16;
    this.height = 16;
  }

  draw() {
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const player = new Player();
player.draw();
