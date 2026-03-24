// games.js

let snakeGameInterval = null;

function startMinigame() {
    const stage = document.getElementById('game-stage');
    stage.innerHTML = ''; // Clear previous game

    // 1. Setup Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set responsive size (multiples of 20 for the grid)
    const gridSize = 20;
    canvas.width = Math.floor((window.innerWidth * 0.8) / gridSize) * gridSize;
    canvas.height = Math.floor((window.innerHeight * 0.6) / gridSize) * gridSize;
    canvas.style.border = "2px solid white";
    canvas.style.display = "block";
    canvas.style.margin = "20px auto";
    stage.appendChild(canvas);

    // 2. Game State
    let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    let direction = { x: gridSize, y: 0 };
    let food = getRandomFoodPosition();
    let score = 0;

    function getRandomFoodPosition() {
        return {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
    }

    // 3. Input Handling
    const handleKeydown = (e) => {
        const keys = {
            ArrowUp:    { x: 0, y: -gridSize },
            ArrowDown:  { x: 0, y: gridSize },
            ArrowLeft:  { x: -gridSize, y: 0 },
            ArrowRight: { x: gridSize, y: 0 }
        };
        const newDir = keys[e.key];
        if (newDir) {
            // Prevent 180-degree turns (cannot turn directly into yourself)
            if (newDir.x !== -direction.x && newDir.y !== -direction.y) {
                direction = newDir;
            }
        }
    };
    window.addEventListener('keydown', handleKeydown);

    // 4. Main Game Loop
    function update() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Wall Collision
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            return gameOver();
        }

        // Self Collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            return gameOver();
        }

        snake.unshift(head);

        // Check Food Collision
        if (head.x === food.x && head.y === food.y) {
            score++;
            if (typeof playBeep === 'function') playBeep(440); // Sound feedback
            food = getRandomFoodPosition();
        } else {
            snake.pop();
        }

        draw();
    }

    function draw() {
        // Clear Canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Food
        ctx.fillStyle = '#ff4d4d';
        ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);

        // Draw Snake
        ctx.fillStyle = '#4ade80';
        snake.forEach((segment, index) => {
            // Make the head a slightly different color
            ctx.fillStyle = index === 0 ? '#22c55e' : '#4ade80';
            ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
        });
    }

    function gameOver() {
        stopMinigame();
        alert(`Game Over! Score: ${score}`);
        startMinigame(); // Restart
    }

    // Store listener on window for cleanup
    window._snakeKeyHandler = handleKeydown;
    snakeGameInterval = setInterval(update, 100);
}

function stopMinigame() {
    clearInterval(snakeGameInterval);
    window.removeEventListener('keydown', window._snakeKeyHandler);
    const stage = document.getElementById('game-stage');
    if (stage) stage.innerHTML = '';
}