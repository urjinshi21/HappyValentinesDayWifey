const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// ---------------- Heart Shape ----------------
function drawHeart(ctx, x, y, size, color, opacity = 1) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(
    x - size / 2,
    y - size / 2,
    x - size,
    y + size / 3,
    x,
    y + size
  );
  ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  ctx.closePath();
  ctx.fillStyle = `rgba(${color},${opacity})`;
  ctx.shadowColor = `rgba(${color},${opacity})`;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.restore();
}

// ---------------- Falling Hearts ----------------
function Star(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.velocity = { x: (Math.random() - 0.5) * 8, y: 3 };
  this.friction = 0.8;
  this.gravity = 1;
}
Star.prototype.draw = function () {
  drawHeart(c, this.x, this.y, this.radius * 2, "255,105,180");
};
Star.prototype.update = function () {
  this.draw();
  if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
    this.velocity.y = -this.velocity.y * this.friction;
    this.shatter();
  } else {
    this.velocity.y += this.gravity;
  }
  if (
    this.x + this.radius + this.velocity.x > canvas.width ||
    this.x - this.radius <= 0
  ) {
    this.velocity.x = -this.velocity.x * this.friction;
    this.shatter();
  }
  this.x += this.velocity.x;
  this.y += this.velocity.y;
};
Star.prototype.shatter = function () {
  this.radius -= 3;
  for (let i = 0; i < 8; i++) {
    miniStars.push(new MiniStar(this.x, this.y, 2));
  }
};

// ---------------- Mini Hearts ----------------
function MiniStar(x, y, radius, color) {
  Star.call(this, x, y, radius, color);
  this.velocity = {
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 30,
  };
  this.friction = 0.8;
  this.gravity = 0.1;
  this.ttl = 100;
  this.opacity = 1;
}
MiniStar.prototype.draw = function () {
  drawHeart(c, this.x, this.y, this.radius * 2, "255,182,193", this.opacity);
};
MiniStar.prototype.update = function () {
  this.draw();
  if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
    this.velocity.y = -this.velocity.y * this.friction;
  } else {
    this.velocity.y += this.gravity;
  }
  this.x += this.velocity.x;
  this.y += this.velocity.y;
  this.ttl -= 1;
  this.opacity -= 0.01;
};

// ---------------- Background Hearts ----------------
function BackgroundHeart(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.opacity = Math.random();
  this.increment = Math.random() * 0.02 + 0.01;
}
BackgroundHeart.prototype.draw = function () {
  drawHeart(c, this.x, this.y, this.radius * 2, "255,192,203", this.opacity);
};
BackgroundHeart.prototype.update = function () {
  this.opacity += this.increment;
  if (this.opacity >= 1 || this.opacity <= 0) this.increment = -this.increment;
  this.draw();
};

// ---------------- Mountains ----------------
function creatMountainRange(mountainAmount, height, color) {
  for (let i = 0; i < mountainAmount; i++) {
    const mountainWidth = canvas.width / mountainAmount;
    c.beginPath();
    c.moveTo(i * mountainWidth, canvas.height);
    c.lineTo(
      i * mountainWidth + mountainWidth + 0.2 * canvas.height,
      canvas.height
    );
    c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
    c.lineTo(i * mountainWidth - 0.2 * canvas.height, canvas.height);
    c.fillStyle = color;
    c.fill();
    c.closePath();
  }
}

// ---------------- Flower Types ----------------
const flowerTypes = [
  { name: "dandelion", color: "#FFD700", shape: "round", petals: 8 },
  { name: "poppy", color: "#FF0000", shape: "round", petals: 4 },
  { name: "blueOrchid", color: "#1E90FF", shape: "bell", petals: 5 },
  { name: "allium", color: "#BA55D3", shape: "star", petals: 6 },
  { name: "redTulip", color: "#FF4500", shape: "tulip", petals: 3 },
  { name: "orangeTulip", color: "#FFA500", shape: "tulip", petals: 3 },
  { name: "whiteTulip", color: "#F8F8FF", shape: "tulip", petals: 3 },
  { name: "pinkTulip", color: "#FF69B4", shape: "tulip", petals: 3 },
  {
    name: "sunflower",
    color: "#FFD700",
    center: "#8B4513",
    shape: "sunflower",
    petals: 12,
  },
];

// ---------------- Flower ----------------
function Flower(x, y, size, type) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.type = type;
  this.pulse = 0;
  this.stemHeight = this.size * (2 + Math.random() * 2);
  this.extraPetals = Math.floor(Math.random() * 3) - 1;
  this.hasDoubleBlossom = Math.random() < 0.15;
  this.rotation = (Math.random() - 0.5) * 0.5;
  this.leaves = [];
  let leafCount = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < leafCount; i++) {
    this.leaves.push({
      side: Math.random() < 0.5 ? -1 : 1,
      offset: 0.3 + Math.random() * 0.6,
      size: 3 + Math.random() * 2,
    });
  }
}
Flower.prototype.drawBlossom = function (
  shape,
  petals,
  petalColor,
  centerColor
) {
  for (let i = 0; i < petals; i++) {
    c.rotate((Math.PI * 2) / petals);
    c.beginPath();
    c.arc(0, -this.size, this.size / 2, 0, Math.PI * 2);
    c.fillStyle = petalColor;
    c.fill();
  }
  c.beginPath();
  c.arc(0, 0, this.size / 2, 0, Math.PI * 2);
  c.fillStyle = centerColor;
  c.fill();
};
Flower.prototype.draw = function (tick) {
  let sway = Math.sin(tick * 0.02 + this.x / 50) * 2;
  this.pulse += 0.05;
  let glow = 0.5 + Math.sin(this.pulse) * 0.3;
  // Stem
  c.beginPath();
  c.strokeStyle = "#228B22";
  c.lineWidth = 2;
  c.moveTo(this.x, this.y);
  c.lineTo(this.x + sway, this.y - this.stemHeight);
  c.stroke();
  // Leaves
  this.leaves.forEach((leaf) => {
    c.save();
    let lx = this.x + sway + leaf.side * leaf.size * 0.8;
    let ly = this.y - this.stemHeight * leaf.offset;
    c.translate(lx, ly);
    c.rotate(leaf.side * 0.3);
    c.beginPath();
    c.ellipse(0, 0, leaf.size, leaf.size / 2, 0, 0, Math.PI * 2);
    c.fillStyle = "#228B22";
    c.fill();
    c.restore();
  });
  // Blossom
  c.save();
  c.translate(this.x + sway, this.y - this.stemHeight);
  c.rotate(this.rotation);
  let flower = flowerTypes.find((f) => f.name === this.type);
  let petalColor = flower.color;
  let centerColor = flower.center || "#FFDAB9";
  let shape = flower.shape;
  let petals = (flower.petals || 5) + this.extraPetals;
  c.shadowBlur = 15;
  c.shadowColor = petalColor;
  c.globalAlpha = glow;
  this.drawBlossom(shape, petals, petalColor, centerColor);
  if (this.hasDoubleBlossom) {
    c.translate(0, this.size * 2.5);
    c.scale(0.7, 0.7);
    this.drawBlossom(shape, petals, petalColor, centerColor);
  }
  c.restore();
  c.globalAlpha = 1;
  c.shadowBlur = 0;
};

// ---------------- Butterfly ----------------
function Butterfly(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size * 0.6; // base size
  this.color = `${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}`;
  this.vx = (Math.random() - 0.5) * 2;
  this.vy = (Math.random() - 0.5) * 2;
  this.angle = Math.random() * Math.PI * 2;
  this.trail = [];
  this.opacity = 0.7 + Math.random() * 0.3;
  this.increment = Math.random() * 0.02 + 0.01;
}

Butterfly.prototype.draw = function () {
  const flap = Math.sin(this.angle * 15) * this.size; 
  c.save();
  c.translate(this.x, this.y);
  c.shadowBlur = 10;
  c.shadowColor = `rgba(${this.color},${this.opacity})`;

  // Front wings (bigger)
  const frontWingScale = 1.5; // increased size
  c.save();
  c.rotate(Math.sin(this.angle * 15) * 0.2);
  c.beginPath();
  c.moveTo(0, 0);
  c.bezierCurveTo(-this.size * 2 * frontWingScale, -this.size, -this.size * 2 * frontWingScale, this.size, 0, this.size / 2);
  c.fillStyle = `rgba(${this.color},${this.opacity})`;
  c.fill();
  c.restore();

  c.save();
  c.scale(-1, 1);
  c.rotate(Math.sin(this.angle * 15) * 0.2);
  c.beginPath();
  c.moveTo(0, 0);
  c.bezierCurveTo(-this.size * 2 * frontWingScale, -this.size, -this.size * 2 * frontWingScale, this.size, 0, this.size / 2);
  c.fillStyle = `rgba(${this.color},${this.opacity})`;
  c.fill();
  c.restore();

  // Back wings (same smaller size)
  c.save();
  c.rotate(-Math.sin(this.angle * 15) * 0.1);
  c.beginPath();
  c.moveTo(0, 0);
  c.bezierCurveTo(-this.size * 1.2, -this.size / 2, -this.size * 1.2, this.size / 2, 0, this.size / 4);
  c.fillStyle = `rgba(${this.color},${this.opacity})`;
  c.fill();
  c.restore();

  c.save();
  c.scale(-1, 1);
  c.rotate(-Math.sin(this.angle * 15) * 0.1);
  c.beginPath();
  c.moveTo(0, 0);
  c.bezierCurveTo(-this.size * 1.2, -this.size / 2, -this.size * 1.2, this.size / 2, 0, this.size / 4);
  c.fillStyle = `rgba(${this.color},${this.opacity})`;
  c.fill();
  c.restore();

  c.restore();
};

Butterfly.prototype.update = function () {
  this.x += this.vx;
  this.y += this.vy;
  this.angle += 0.05;
  if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
  if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

  this.opacity += this.increment;
  if (this.opacity >= 1 || this.opacity <= 0.5) this.increment = -this.increment;

  this.trail.push(new FairyDust(this.x, this.y, this.color));
  if (this.trail.length > 15) this.trail.shift();
  this.trail.forEach((d) => d.update());

  this.draw();
};


// ---------------- Fairy Dust ----------------
function FairyDust(x, y, color) {
  this.x = x;
  this.y = y;
  this.size = 1 + Math.random() * 2;
  this.color = color;
  this.opacity = 0.5 + Math.random() * 0.5;
  this.vx = (Math.random() - 0.5) * 0.5;
  this.vy = -Math.random() * 1;
}
FairyDust.prototype.draw = function () {
  c.save();
  c.beginPath();
  c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  c.fillStyle = `rgba(${this.color},${this.opacity})`;
  c.shadowBlur = 5;
  c.shadowColor = `rgba(${this.color},${this.opacity})`;
  c.fill();
  c.restore();
};
FairyDust.prototype.update = function () {
  this.x += this.vx;
  this.y += this.vy;
  this.opacity -= 0.01;
  if (this.opacity < 0) this.opacity = 0;
  this.draw();
};

// ---------------- Animation Setup ----------------
let stars, miniStars, backgroundStarsArr, flowers, petalsArray, butterfliesArr;
let ticker = 0;
let flowerSpawnRate = 120;
let randomSpawnRate = 75;

const groundHeight = 0.09 * canvas.height;
let inf = 1e9;

function canPlaceFlower(newX, minSpacing) {
  for (let f of flowers) {
    if (Math.abs(f.x - newX) < minSpacing) return false;
  }
  return true;
}

function init() {
  stars = [];
  miniStars = [];
  backgroundStarsArr = [];
  flowers = [];
  petalsArray = [];
  butterfliesArr = [];

  // Background hearts
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 3;
    backgroundStarsArr.push(new BackgroundHeart(x, y, radius));
  }

  // Butterflies
  for (let i = 0; i < 10; i++) {
    butterfliesArr.push(
      new Butterfly(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        6
      )
    );
  }
}

// ---------------- Animation Loop ----------------
function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "#171e26";
  c.fillRect(0, 0, canvas.width, canvas.height);

  backgroundStarsArr.forEach((b) => b.update());

  creatMountainRange(1, canvas.height * 0.7, "#384551");
  creatMountainRange(2, canvas.height * 0.6, "#2B3843");
  creatMountainRange(3, canvas.height * 0.4, "#26333E");

  c.fillStyle = "#182028";
  c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

  flowers.forEach((f) => f.draw(ticker));
  stars.forEach((s, i) => {
    s.update();
    if (s.radius <= 0) stars.splice(i, 1);
  });
  miniStars.forEach((m, i) => {
    m.update();
    if (m.ttl <= 0) miniStars.splice(i, 1);
  });
  petalsArray.forEach((p, i) => {
    p.update();
    if (p.ttl <= 0 || p.opacity <= 0) petalsArray.splice(i, 1);
  });

  butterfliesArr.forEach((b) => b.update());

  ticker++;
  if (ticker >= inf) ticker = 0;

  if (ticker % randomSpawnRate == 0) {
    stars.push(new Star(Math.random() * canvas.width, -100, 9, "#E3EAEF"));
    randomSpawnRate = Math.floor(Math.random() * (200 - 125 + 1) + 125);
  }

  if (flowers.length < 650 && ticker % flowerSpawnRate == 0) {
    let tries = 0;
    let placed = false;
    let minSpacing = 25;
    while (!placed && tries < 50) {
      let newX = Math.random() * canvas.width;
      if (canPlaceFlower(newX, minSpacing)) {
        flowers.push(
          new Flower(
            newX,
            canvas.height - groundHeight,
            6,
            flowerTypes[Math.floor(Math.random() * flowerTypes.length)].name
          )
        );
        placed = true;
      }
      tries++;
    }
  }

  requestAnimationFrame(animate);
}

init();
animate();
