var btn = document.getElementById("heartTxt");
var music = document.getElementById("bgMusic");
var showImageInterval;
var started = false;
var imageIndex = 0;
var myImage = document.getElementById("img");
var myTxt = document.getElementById("Txt");
var imgCard = document.getElementById("imgCard");
var len = imageArray.length;

// Initially hide the card
imgCard.style.opacity = 0;

function showImage() {
  myImage.setAttribute("src", imageArray[imageIndex]);
  myTxt.innerHTML = txtArray[imageIndex];

  myImage.classList.add("flicker");
  myImage.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";

  imageIndex++;
  if (imageIndex >= len) {
    imageIndex = 0;
  }
}

function play() {
  if (started) return;
  started = true;

  // Play the music (won't restart if already playing)
  music.play().catch((e) => console.log("Music couldn't autoplay:", e));

  // Hide only the heart button
  btn.style.display = "none";

  // Show the card container
  imgCard.style.opacity = 1;

  // Reset image and text for first display
  myImage.setAttribute("src", imageArray[imageIndex]);
  myTxt.innerHTML = txtArray[imageIndex];
  myImage.style.width = "90%";
  myImage.style.height = "auto";

  // Fade out typeDiv
  document.getElementById("typeDiv").style.opacity = 0;

  // Start the slideshow (slower: 5 seconds per image)
  showImageInterval = setInterval(showImage, 5000);
}


// Optional: fade in the heart button gradually after page load
setTimeout(function () {
  buttonInterval = setInterval(buttonFadeIn, 50);
}, 1000);
