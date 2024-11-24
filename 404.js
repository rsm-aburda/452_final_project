const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 200;

let dino = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    dy: 0,
    gravity: 0.6,
    jump: -10,
    grounded: true,
};

let obstacle = {
    x: canvas.width,
    y: 170,
    width: 20,
    height: 30,
    speed: 5,
};

let score = 0;

function drawDino() {
    ctx.font = "30px Arial";
    ctx.fillText("🎵", dino.x, dino.y + 25); // Adjust for emoji alignment
}

function drawObstacle() {
    ctx.fillStyle = "#E0E0E0";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dino movement
    if (dino.y + dino.height < canvas.height) {
        dino.dy += dino.gravity;
        dino.grounded = false;
    } else {
        dino.dy = 0;
        dino.grounded = true;
    }
    dino.y += dino.dy;

    // Obstacle movement
    obstacle.x -= obstacle.speed;

    // Reset obstacle
    if (obstacle.x + obstacle.width < 0) {
        obstacle.x = canvas.width;
        score++;
    }

    // Collision detection
    if (
        dino.x < obstacle.x + obstacle.width &&
        dino.x + dino.width > obstacle.x &&
        dino.y < obstacle.y + obstacle.height &&
        dino.y + dino.height > obstacle.y
    ) {
        alert(`Game Over! Your score: ${score}`);
        obstacle.x = canvas.width;
        score = 0;
    }

    // Draw elements
    drawDino();
    drawObstacle();
    drawScore();

    requestAnimationFrame(update);
}

function jump() {
    if (dino.grounded) {
        dino.dy = dino.jump;
    }
}

// Add event listener for the Jump button
document.getElementById("jumpButton").addEventListener("click", jump);

// Start the game
update();
