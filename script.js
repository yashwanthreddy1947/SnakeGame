// Game Constants
const inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 6;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
const board = document.getElementById('board'); // Assuming an element with id 'board' exists
const scoreBox = document.getElementById('scoreBox'); // Assuming an element with id 'scoreBox' exists

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snakeArr) {
    // If the snake collides with itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true; 
        }
    }

    // If the snake collides with the wall
    if (snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0) {
        return true;
    }

    return false;
}

function generateFood() {
    let a = 2, b = 16;
    let newFood = { 
        x: Math.floor(a + (b - a + 1) * Math.random()), 
        y: Math.floor(a + (b - a + 1) * Math.random()) 
    };

    // Check if food appears on the snake
    snakeArr.forEach(segment => {
        if (segment.x === newFood.x && segment.y === newFood.y) {
            newFood = generateFood(); // Regenerate food if it appears on the snake
        }
    });

    return newFood;
}

function gameEngine() {
    // 1. Check for collision
    musicSound.play();
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir.x = 0;
        inputDir.y = 0;
        alert("Game Over... Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        musicSound.play();
    }

    // 2. If the snake has eaten the food, increment the score and regenerate food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        scoreBox.innerHTML = "Score : " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = generateFood();
    }

    // 3. Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // 4. Render/Display the snake and food
    // Clear the board
    board.innerHTML = "";

    // Display the snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts from here
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) { // Prevent reversing direction
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) { // Prevent reversing direction
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) { // Prevent reversing direction
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) { // Prevent reversing direction
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;
        default:
            break;
    }
});
