let i = 0;
let text1 = "Hi My Precious Beautiful Wifeey <3 ";
let text2 = "Happy Valentine's Daay! and I loove you so soo muchh!";
let speed = 100;

function typeWriter(text, para) {
  if (ok == 2) {
    clearInterval(typeInterval);
  }
  if (i < text.length) {
    document.getElementById(para).innerHTML += text.charAt(i);
    i++;
    speed = Math.random() * 50 + 100;
  } else {
    if (ok == 0) {
      i = 0;
    }
    ok += 1;
  }
}

var typeInterval;

typeInterval = setInterval(function () {
  if (ok == 0) {
    typeWriter(text1, "txt1");
  } else if (ok == 1) {
    typeWriter(text2, "txt2");
  }
}, 100);

// ------------------ ADDITION ------------------
// Smooth color fade
let colors = ["#ff69b4", "#ff1493", "#ffb6c1", "#ff7f50", "#ff4500", "#ff6347"];
let colorIndex = 0;
let txt1Elem = document.getElementById("txt1");
let txt2Elem = document.getElementById("txt2");

function lerpColor(a, b, amount) {
  let ar = parseInt(a.substring(1, 3), 16),
    ag = parseInt(a.substring(3, 5), 16),
    ab = parseInt(a.substring(5, 7), 16),
    br = parseInt(b.substring(1, 3), 16),
    bg = parseInt(b.substring(3, 5), 16),
    bb = parseInt(b.substring(5, 7), 16);
  let rr = ar + amount * (br - ar);
  let rg = ag + amount * (bg - ag);
  let rb = ab + amount * (bb - ab);
  return `rgb(${Math.round(rr)},${Math.round(rg)},${Math.round(rb)})`;
}

let fadeAmount = 0;
let currentColor = colors[colorIndex % colors.length];
let nextColor = colors[(colorIndex + 1) % colors.length];

setInterval(() => {
  fadeAmount += 0.05;
  if (fadeAmount >= 1) {
    fadeAmount = 0;
    colorIndex++;
    currentColor = colors[colorIndex % colors.length];
    nextColor = colors[(colorIndex + 1) % colors.length];
  }
  let newColor = lerpColor(currentColor, nextColor, fadeAmount);
  txt1Elem.style.color = newColor;
  txt2Elem.style.color = newColor;

  // Dimmer glow
  txt1Elem.style.textShadow = `0 0 5px ${newColor}`;
  txt2Elem.style.textShadow = `0 0 5px ${newColor}`;
}, 50);
