const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const messageBox = document.getElementById("messageBox");
const bgMusic = document.getElementById("bgMusic");
const homeOverlay = document.getElementById("homeOverlay");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn"); // NEW: Restart button

startBtn.addEventListener("click", () => {
  homeOverlay.style.display = "none";
  bgMusic.play();
});

let isJumping = false;
let isWalking = false;
let gameOver = false;
let position = 0;
let distance = 0;
let bgX = 0;
let messageCooldown = false;

// ✅ Gift variables
let giftSpawned = false;
let giftBox = null;

// Player images
const playerImages = ["player-front.png", "player-side1.png"];

// Bob effect
let bobOffset = 0;
let bobDirection = 1;
const bobHeight = 3;
const bobSpeed = 0.5;

// Obstacles
let obstacles = [];
const obstacleSpeed = 4;
const obstacleImages = ["rock.png", "flo.png", "spike.png", "wer.png", "eyes.png"];

// Messages
const messages = [
  "🌍 You step into unknown lands",
  "🎒 You collected supplies",
  "📜 A story unfolds...",
  "✨ A mysterious power awakens",
  "🧭 Keep moving forward",
  "🦖 The journey never ends"
];

// Message
function showMessage(text) {
  if (messageCooldown) return;
  messageCooldown = true;

  messageBox.innerText = text;
  messageBox.style.display = "block";

  setTimeout(() => {
    messageBox.style.display = "none";
    messageCooldown = false;
  }, 3000);
}

// Start music on first key press
document.addEventListener("keydown", () => {
  if (bgMusic.paused) bgMusic.play();
}, { once: true });

// Jump function
function jump() {
  if (isJumping || gameOver) return;
  isJumping = true;

  let up = setInterval(() => {
    if (position >= 120) {
      clearInterval(up);
      let down = setInterval(() => {
        if (position <= 0) {
          clearInterval(down);
          isJumping = false;
        }
        position -= 6;
        player.style.bottom = 60 + position + bobOffset + "px";
      }, 20);
    }
    position += 6;
    player.style.bottom = 60 + position + bobOffset + "px";
  }, 20);
}

// Controls
function handleKeyDown(e) {
  if (gameOver) return;
  if (e.code === "Space") jump();
  if (e.code === "ArrowRight") {
    isWalking = true;
    player.style.backgroundImage = `url(${playerImages[1]})`;
  }
}

function handleKeyUp(e) {
  if (e.code === "ArrowRight") isWalking = false;
  if (!isWalking && !isJumping) {
    player.style.backgroundImage = `url(${playerImages[0]})`;
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Spawn ALL obstacles (one of each image)
obstacleImages.forEach((img, index) => {
  let obs = document.createElement("div");
  obs.classList.add("obstacle");

  obs.style.backgroundImage = `url(${img})`;
  obs.style.backgroundSize = "contain";
  obs.style.backgroundRepeat = "no-repeat";
  obs.style.backgroundPosition = "center";

  obs.style.width = "150px";
  obs.style.height = "150px";
  obs.style.bottom = "40px";
  obs.style.left = 600 + index * 400 + "px"; // space them out

  game.appendChild(obs);
  obstacles.push(obs);
});


// Story overlay
const storyOverlay = document.getElementById("storyOverlay");
const storyHeader = document.getElementById("storyHeader");
const storyText = document.getElementById("storyText");
const closeStory = document.getElementById("closeStory");

function showStory(header, text) {
  storyHeader.innerText = header;
  storyText.innerText = text;
  storyOverlay.style.display = "flex";
}

closeStory.addEventListener("click", () => {
  storyOverlay.style.display = "none";
});

// Fireworks function
function launchFireworks(count = 100) { // big number for lots
  const colors = ["red", "orange", "yellow", "white", "blue", "purple"];
  for (let i = 0; i < count; i++) {
    const firework = document.createElement("div");
    firework.classList.add("firework");

    firework.style.left = Math.random() * 100 + "vw";
    firework.style.top = Math.random() * 80 + "vh";
    firework.style.background = colors[Math.floor(Math.random() * colors.length)];

    const size = 4 + Math.random() * 8;
    firework.style.width = size + "px";
    firework.style.height = size + "px";

    document.body.appendChild(firework);
    firework.addEventListener("animationend", () => firework.remove());

    // Stagger explosions slightly
    firework.style.animationDelay = (Math.random() * 1.5) + "s";
  }
}

function launchBalloons(count = 50) { // lots of balloons
  const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];
  for (let i = 0; i < count; i++) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");

    balloon.style.left = Math.random() * 95 + "vw";
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];

    const size = 20 + Math.random() * 30;
    balloon.style.width = size + "px";
    balloon.style.height = size * 1.3 + "px";

    document.body.appendChild(balloon);
    balloon.addEventListener("animationend", () => balloon.remove());

    balloon.style.animationDelay = (Math.random() * 1.5) + "s";
  }
}



function spawnButterfly() {
  if (!isWalking || gameOver) return;

  const butterfly = document.createElement("div");
  butterfly.classList.add("butterfly");
  butterfly.style.position = "absolute";
  butterfly.style.width = "40px";   // proportional size
  butterfly.style.height = "40px";
  butterfly.style.backgroundImage = "url('butterfly.png')"; // make sure it's big & transparent
  butterfly.style.backgroundSize = "cover"; // fills div nicely
  butterfly.style.backgroundRepeat = "no-repeat";
  butterfly.style.left = player.offsetLeft + (Math.random() * 20 - 10) + "px"; // slight horizontal randomness
  butterfly.style.bottom = parseInt(player.style.bottom) + player.offsetHeight + 10 + "px"; // above head
  butterfly.style.opacity = 1;
  butterfly.style.pointerEvents = "none";
  butterfly.style.zIndex = 100;

  // Sparkle effect: small color circle inside butterfly
  const sparkle = document.createElement("div");
  sparkle.style.position = "absolute";
  sparkle.style.width = "6px";
  sparkle.style.height = "6px";
  sparkle.style.borderRadius = "50%";
  sparkle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 80%)`;
  sparkle.style.left = "50%";
  sparkle.style.top = "50%";
  sparkle.style.transform = "translate(-50%, -50%)";
  sparkle.style.opacity = 1;
  butterfly.appendChild(sparkle);

  game.appendChild(butterfly);

  let life = 0;
  const move = setInterval(() => {
    life++;
    // float upwards with gentle horizontal drift
    butterfly.style.bottom = parseFloat(butterfly.style.bottom) + 0.7 + "px";
    butterfly.style.left = parseFloat(butterfly.style.left) + (Math.random() * 1 - 0.5) + "px";
    
    // sparkle fade
    sparkle.style.opacity = 1 - life / 50;

    // butterfly fade
    butterfly.style.opacity = 1 - life / 50;

    if (life > 50) {
      clearInterval(move);
      butterfly.remove();
    }
  }, 30);
}


// ---------------- MAIN GAME LOOP ----------------
setInterval(() => {
  if (gameOver) return;

  if (isWalking) {
    distance++;
    scoreText.innerText = "Distance: " + distance;

    // Background move
    bgX -= 2;
    game.style.backgroundPosition = bgX + "px 0";

    // Bob effect
    bobOffset += bobSpeed * bobDirection;
    if (bobOffset >= bobHeight || bobOffset <= -bobHeight) bobDirection *= -1;
    if (!isJumping) player.style.bottom = 40 + position + bobOffset + "px";

        // Move obstacles
    obstacles.forEach(obs => {
      let left = parseInt(obs.style.left);
      left -= obstacleSpeed;
      if (left < -150) left = 1200;
      obs.style.left = left + "px";
    });

    // 🎁 Gift spawn
    if (distance >= 750 && !giftSpawned) {
      giftSpawned = true;
      giftBox = document.createElement("div");
      giftBox.classList.add("gift");
      giftBox.style.position = "fixed";
      giftBox.style.left = "600px";
      giftBox.style.bottom = "10px";
      giftBox.style.width = "200px";
      giftBox.style.height = "200px";
      giftBox.style.backgroundImage = "url('gift.png')";
      giftBox.style.backgroundSize = "contain";
      giftBox.style.backgroundRepeat = "no-repeat";
      giftBox.style.cursor = "pointer";

      game.appendChild(giftBox);

      giftBox.addEventListener("click", () => {
        isWalking = false;
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
            launchFireworks(100);
            launchBalloons(50);
            showMessage("🎆 Congratulations! You reached the end of the journey!", {
            force: true,
            duration: 90000000000
            });
            player.style.bottom = 40 + "px";
      })}
     
    // spawn butterfly every few frames
if (distance % 5 === 0) {
  spawnButterfly();
}

    // Stories & fireworks (unchanged)
    if (distance === 50) {
      showStory("✨📜About Me📜✨",
      "As a Computer Engineering, I am eager to apply my technical knowledge and develop my communication skills in a professional setting. I am seeking an work opportunity where I can contribute to your company's growth while gaining valuable hands-on experience in a dynamic and collaborative environment");
      launchFireworks(200);
    } else if (distance === 200) {
      showStory("✨📜Basic Information📜✨",
      "Nicole Andrea Gula Catandijan\nCatandijan July 11, 2005\nBlk 1 Lot 86 Phase B Legian 2\nCarsadang Bago 1, City of Imus, Cavite\n+63 963 210 2437");
      launchFireworks(200);
    } else if (distance === 250) {
      showStory("✨📜Educational Background📜✨",
      "Polytechnic University of The Philippines - Parañaque City Campus\nBachelor of Science in Computer Engineering 2023 - Present\n\nSt. Michael Institute of Bacoor, Inc. | Poblacion, Bacoor City, Cavite\nScience, Technology, Engineering, and Mathematics, Senior High School 2021 - 2023\n\nImus National High School | Bukandala 3, Imus City, Cavite\nJunior High School 2017 - 2021\n");
      launchFireworks(200);
    } else if (distance === 350) {
      showStory("✨📜Work Experience📜✨", "MPT South Management Corporation | Alapan 2-B, Imus, Cavite\nTechnology Technical Support Intern (ITS Technology Department)\nAugust 2025 - October 2025\n\nFleur De Rey Flower Shop | Poblacion IV-D, Imus, Cavite\nSeasonal Helper and Seller\nFebruary 2025\n\nBinakayan Hospital and Medical Center | Binakayan, Kawit, Cavite\nIntern (Cardio Pulmonary Department)\nMarch 2023\n");
      launchFireworks(200);
    } else if (distance === 450) {
      showStory("✨📜Technical Skills📜✨", "Microsoft Office Suite (Word, Excel, PowerPoint)\n\nCanva Graphic Design\n\nBasic Hardware & Software Troubleshooting\n\nData & Record Management\n");
      launchFireworks(200);
    } else if (distance === 550) {
      showStory("✨📜Interpersonal Skills📜✨", "Effective Communicator\n\nHighly Adaptable\n\nEager to Learn / Committed to Continuous Learning\n\nOrganization and Attention to Detail\n\nTime and Task Management\n");
      launchFireworks(200);
    } else if (distance === 650) {
      showStory("✨📜Contact Info📜✨", "");
      launchFireworks(500);
    }
  }
}, 50);


// ---------------- RESTART BUTTON ----------------
restartBtn.addEventListener("click", () => {
  // Reset game state
  isJumping = false;
  isWalking = false;
  gameOver = false;
  position = 0;
  distance = 0;
  bgX = 0;
  messageCooldown = false;

  // Reset UI
  scoreText.innerText = "Distance: 0";
  messageBox.style.display = "none";
  storyOverlay.style.display = "none";

  // Reset player
  player.style.bottom = "40px";
  player.style.backgroundImage = `url(${playerImages[0]})`;

  // Remove gift if exists
  if (giftBox) {
    giftBox.remove();
    giftBox = null;
    giftSpawned = false;
  }

  // Reset obstacles position
  obstacles.forEach((obs, index) => {
    obs.style.left = 600 + index * 400 + "px";
  });

  // Re-enable controls
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
});

