// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const messageElement = document.getElementById('gameMessage');

// Game state
let score = 0;
let lives = 3;
let gameRunning = true;
let animationId;

// Grid settings
const GRID_SIZE = 20;
const COLS = canvas.width / GRID_SIZE;
const ROWS = canvas.height / GRID_SIZE;

// Simple maze layout (1 = wall, 0 = path, 2 = dot)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,2,1,1,2,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,2,1,1,1,0,0,0,0,1,1,1,2,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,2,1,0,0,0,0,0,0,0,0,1,2,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2,2,2,2,1,0,0,0,0,0,0,0,0,1,2,2,2,2,0,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,2,1,0,0,0,0,0,0,0,0,1,2,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,2,1,1,2,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Game objects
const pacman = {
    x: 1,
    y: 1,
    direction: 0, // 0: right, 1: down, 2: left, 3: up
    nextDirection: 0,
    mouthOpen: true,
    animationTimer: 0,
    moveTimer: 0,
    moveSpeed: 8 // Lower number = faster movement
};

const ghost = {
    x: 14,
    y: 13,
    direction: 0,
    speed: 1,
    moveTimer: 0
};

// Count initial dots
let totalDots = 0;
for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
        if (maze[row][col] === 2) {
            totalDots++;
        }
    }
}

// Direction vectors
const directions = [
    { x: 1, y: 0 },  // right
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }, // left
    { x: 0, y: -1 }  // up
];

// Input handling
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    switch (e.key) {
        case 'ArrowRight':
            pacman.nextDirection = 0;
            break;
        case 'ArrowDown':
            pacman.nextDirection = 1;
            break;
        case 'ArrowLeft':
            pacman.nextDirection = 2;
            break;
        case 'ArrowUp':
            pacman.nextDirection = 3;
            break;
    }
});

// Check if position is valid (not a wall)
function isValidPosition(x, y) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
        return false;
    }
    return maze[y][x] !== 1;
}

// Move Pac-Man
function movePacman() {
    pacman.moveTimer++;
    
    // Only move every few frames for step-by-step movement
    if (pacman.moveTimer < pacman.moveSpeed) return;
    pacman.moveTimer = 0;
    
    // Try to change direction if requested
    const nextDir = directions[pacman.nextDirection];
    if (isValidPosition(pacman.x + nextDir.x, pacman.y + nextDir.y)) {
        pacman.direction = pacman.nextDirection;
    }
    
    // Move in current direction
    const dir = directions[pacman.direction];
    const newX = pacman.x + dir.x;
    const newY = pacman.y + dir.y;
    
    if (isValidPosition(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
        
        // Handle tunnel effect (wrap around)
        if (pacman.x < 0) pacman.x = COLS - 1;
        if (pacman.x >= COLS) pacman.x = 0;
        
        // Eat dot
        if (maze[pacman.y][pacman.x] === 2) {
            maze[pacman.y][pacman.x] = 0;
            score += 10;
            totalDots--;
            updateScore();
            
            // Check win condition
            if (totalDots === 0) {
                gameWin();
            }
        }
    }
    
    // Animate mouth
    pacman.animationTimer++;
    if (pacman.animationTimer % 5 === 0) {
        pacman.mouthOpen = !pacman.mouthOpen;
    }
}

// Move Ghost with simple AI
function moveGhost() {
    ghost.moveTimer++;
    if (ghost.moveTimer < 12) return; // Slightly slower than Pac-Man
    ghost.moveTimer = 0;
    
    // Simple AI: move towards Pac-Man
    const dx = pacman.x - ghost.x;
    const dy = pacman.y - ghost.y;
    
    let possibleMoves = [];
    
    // Check all directions
    for (let i = 0; i < 4; i++) {
        const dir = directions[i];
        const newX = ghost.x + dir.x;
        const newY = ghost.y + dir.y;
        
        if (isValidPosition(newX, newY)) {
            possibleMoves.push({
                direction: i,
                x: newX,
                y: newY,
                distance: Math.abs(newX - pacman.x) + Math.abs(newY - pacman.y)
            });
        }
    }
    
    if (possibleMoves.length > 0) {
        // Choose the move that gets closest to Pac-Man
        possibleMoves.sort((a, b) => a.distance - b.distance);
        const bestMove = possibleMoves[0];
        
        ghost.x = bestMove.x;
        ghost.y = bestMove.y;
        ghost.direction = bestMove.direction;
        
        // Handle tunnel effect
        if (ghost.x < 0) ghost.x = COLS - 1;
        if (ghost.x >= COLS) ghost.x = 0;
    }
}

// Check collision between Pac-Man and Ghost
function checkCollision() {
    if (pacman.x === ghost.x && pacman.y === ghost.y) {
        lives--;
        updateLives();
        
        if (lives <= 0) {
            gameOver();
        } else {
            // Reset positions
            pacman.x = 1;
            pacman.y = 1;
            ghost.x = 14;
            ghost.y = 13;
            showMessage("Life lost! Be careful!", "info-message");
            setTimeout(() => {
                if (gameRunning) messageElement.textContent = "";
            }, 2000);
        }
    }
}

// Drawing functions
function drawMaze() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * GRID_SIZE;
            const y = row * GRID_SIZE;
            
            switch (maze[row][col]) {
                case 1: // Wall
                    ctx.fillStyle = '#0000ff';
                    ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
                    ctx.strokeStyle = '#4444ff';
                    ctx.strokeRect(x, y, GRID_SIZE, GRID_SIZE);
                    break;
                case 2: // Dot
                    ctx.fillStyle = '#000080';
                    ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
                    ctx.fillStyle = '#ffff00';
                    ctx.beginPath();
                    ctx.arc(x + GRID_SIZE/2, y + GRID_SIZE/2, 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                default: // Path
                    ctx.fillStyle = '#000080';
                    ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
                    break;
            }
        }
    }
}

function drawPacman() {
    const x = pacman.x * GRID_SIZE + GRID_SIZE/2;
    const y = pacman.y * GRID_SIZE + GRID_SIZE/2;
    
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    
    if (pacman.mouthOpen) {
        // Draw Pac-Man with mouth open
        const startAngle = (pacman.direction * Math.PI/2) + Math.PI/6;
        const endAngle = (pacman.direction * Math.PI/2) - Math.PI/6;
        ctx.arc(x, y, GRID_SIZE/2 - 2, startAngle, endAngle);
        ctx.lineTo(x, y);
    } else {
        // Draw full circle when mouth closed
        ctx.arc(x, y, GRID_SIZE/2 - 2, 0, Math.PI * 2);
    }
    
    ctx.fill();
}

function drawGhost() {
    const x = ghost.x * GRID_SIZE + GRID_SIZE/2;
    const y = ghost.y * GRID_SIZE + GRID_SIZE/2;
    const radius = GRID_SIZE/2 - 2;
    
    // Add ghostly transparency
    ctx.globalAlpha = 0.9;
    
    // Draw ghost body with classic shape
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    
    // Top rounded part
    ctx.arc(x, y - 2, radius, Math.PI, 0, false);
    
    // Sides going down
    ctx.lineTo(x + radius, y + radius - 4);
    
    // Wavy bottom for ghostly effect
    ctx.lineTo(x + radius - 3, y + radius);
    ctx.lineTo(x + radius - 6, y + radius - 3);
    ctx.lineTo(x + radius - 9, y + radius);
    ctx.lineTo(x + radius - 12, y + radius - 3);
    ctx.lineTo(x - radius + 12, y + radius - 3);
    ctx.lineTo(x - radius + 9, y + radius);
    ctx.lineTo(x - radius + 6, y + radius - 3);
    ctx.lineTo(x - radius + 3, y + radius);
    ctx.lineTo(x - radius, y + radius - 4);
    
    ctx.closePath();
    ctx.fill();
    
    // Add a subtle glow effect
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 8;
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Draw eyes (larger and more expressive)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x - 4, y - 4, 3, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 4, y - 4, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye pupils
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x - 4, y - 3, 2, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 3, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Add small white highlight in eyes for more life
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - 4.5, y - 4, 0.5, 0, Math.PI * 2);
    ctx.arc(x + 3.5, y - 4, 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset transparency
    ctx.globalAlpha = 1.0;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPacman();
    drawGhost();
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateLives() {
    livesElement.textContent = lives;
}

function showMessage(text, className) {
    messageElement.textContent = text;
    messageElement.className = className;
}

function gameOver() {
    gameRunning = false;
    showMessage("GAME OVER! Press F5 to restart", "game-over-message");
    cancelAnimationFrame(animationId);
}

function gameWin() {
    gameRunning = false;
    showMessage("YOU WIN! All dots collected! Press F5 to play again", "win-message");
    cancelAnimationFrame(animationId);
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    movePacman();
    moveGhost();
    checkCollision();
    draw();
    
    animationId = requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    updateScore();
    updateLives();
    draw();
    showMessage("Use arrow keys to move! Eat all dots and avoid the red ghost!", "info-message");
    
    setTimeout(() => {
        if (gameRunning) {
            messageElement.textContent = "";
            gameLoop();
        }
    }, 3000);
}

// Start the game
initGame();
