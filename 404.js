const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 200;

let gameStarted = false; // Tracks whether the game has started

let dino = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    dy: 0, // Vertical velocity
    gravity: 0.6, // Downward acceleration
    jump: -10, // Jump strength
    grounded: true, // Is the dino on the ground?
};

let obstacle = {
    x: canvas.width,
    y: 170,
    width: 20,
    height: 30,
    speed: 5, // Speed of obstacle
};

let score = 0;

function drawDino() {
    ctx.fillStyle = "#1db954"; // Green box color
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function drawObstacle() {
    ctx.fillStyle = "#E0E0E0"; // Light gray for the obstacle
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF"; // White text
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply gravity
    if (dino.y + dino.height < canvas.height) {
        dino.dy += dino.gravity;
        dino.grounded = false;
    } else {
        dino.dy = 0;
        dino.grounded = true;
        dino.y = canvas.height - dino.height; // Ensure it stays on the ground
    }
    dino.y += dino.dy;

    if (gameStarted) {
        // Move obstacle
        obstacle.x -= obstacle.speed;

        // Reset obstacle
        if (obstacle.x + obstacle.width < 0) {
            obstacle.x = canvas.width;
            score++;
        }

        // Check for collision
        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            alert(`Game Over! Your score: ${score}`);
            obstacle.x = canvas.width;
            score = 0;
            gameStarted = false; // Reset game state
        }
    }

    // Draw elements
    drawDino();
    drawObstacle();
    drawScore();

    requestAnimationFrame(update);
}

function jump() {
    if (!gameStarted) {
        gameStarted = true; // Start the game on first jump
    }

    if (dino.grounded) {
        dino.dy = dino.jump; // Apply jump force
    }
}

// Add event listener for Jump button
document.getElementById("jumpButton").addEventListener("click", jump);

// Start the game loop
update();
