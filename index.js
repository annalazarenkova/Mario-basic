const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

class Player {
  constructor() {
      this.speed = 10
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 30;
    this.height = 30;
  }
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}

class Platform {
  constructor({ x, y, width}) {
    this.position = {
      x: x, // left from 0
      y: y, //down from up
    };
    this.width = width;
    this.height = 40;
  }

  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class GenericObject {
  constructor({ x, y }) {
    this.position = {
      x: x, // left from 0
      y: y, //down from up
    };
    this.width = 50;
    this.height = 150;
  }

  draw() {
    c.fillStyle = "green";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

let player = new Player();
let platforms = [];
let genericObjects = [];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};
player.draw();

let scrollOffset = 0;

function init() {
  player = new Player();
  platforms = [
    new Platform({ x: 250, y: 200, width:200 }),
    new Platform({ x: 600, y: 350, width:200 }),
    new Platform({ x: 0, y: 540, width:500 }),
    new Platform({ x: 600, y: 540, width:150 }),
    new Platform({ x: 800, y: 540, width:200 }),
    new Platform({ x: 1250, y: 540, width: 900 }),
    new Platform({ x: 2300, y: 540, width: 600 }),
    // new Platform({ x: 200 * 5 + 150, y: 540, width: 500 })
  ];
  genericObjects = [
    new GenericObject({ x: 424, y: 426 }),
    new GenericObject({ x: 100, y: 426 }),
  ];

  player.draw();

  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  //movement
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if ((keys.left.pressed && player.position.x > 100)
  || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed *0.66;
      });
    }
  }
  //platform colliion detection

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });
  // win  condition
  // if (scrollOffset > 2000) {
  //   return alert("You WIN");
  // }

  //loose condition
  if (player.position.y > canvas.height) {
    init();
  }
}
init()
animate();

window.addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 37: //LEFT
      keys.left.pressed = true;
      break;
    case 40: //DOWN
      break;
    case 39: //RIGHT
      keys.right.pressed = true;
      break;
    case 38: //UP
      player.velocity.y -= 15;
      break;
  }
});

window.addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 37: //LEFT
      keys.left.pressed = false;
      break;
    case 40: //DOWN
      break;
    case 39: //RIGHT
      keys.right.pressed = false;
      break;
    case 38: //UP
      break;
  }
});
