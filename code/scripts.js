// Canvas element and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player properties
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 25,
    speed: 7,
    color: 'purple'
};

// Initial enemy positions
const initialEnemyPositions = [
    { x: canvas.width / 4, y: canvas.height / 4 },   // Enemy 1
    { x: (canvas.width / 4) * 3, y: (canvas.height / 4) * 3 } // Enemy 2
];

// Enemy properties
const enemies = [
    {
        x: initialEnemyPositions[0].x,
        y: initialEnemyPositions[0].y,
        radius: 20,
        speed: 2,
        color: 'red',
        active: true // Whether the enemy is active
    },
    {
        x: initialEnemyPositions[1].x,
        y: initialEnemyPositions[1].y,
        radius: 20,
        speed: 2,
        color: 'green',
        active: true // Whether the enemy is active
    }
];

// Score variable
let score = 0;

// Game state
let gameOver = false;
let gameWon = false;

// Keyboard input
const keys = {
    KeyW: false, // Move up
    KeyA: false, // Move left
    KeyS: false, // Move down
    KeyD: false, // Move right
    KeyE: false, // Attack
    KeyR: false  // Reset enemies
};

document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.code)) {
        keys[event.code] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.code)) {
        keys[event.code] = false;
    }
});

// Click event for retry
canvas.addEventListener('click', (event) => {
    if (gameOver || gameWon) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if click is on retry button
        if (x > canvas.width / 2 - 50 && x < canvas.width / 2 + 50 && y > canvas.height / 2 - 30 && y < canvas.height / 2) {
            resetGame();
        }
    }
});

// Reset game function
function resetGame() {
    // Reset player position
    player.x = canvas.width / 2;
    player.y = canvas.height / 2; 

    // Reset enemies
    resetEnemies(); 

    // Reset score
    score = 0; 

    // Reset game over flag
    gameOver = false;
    gameWon = false;
}

// Reset enemies function
function resetEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x = initialEnemyPositions[index].x;
        enemy.y = initialEnemyPositions[index].y;
        enemy.active = true;
    });
}

// Update player and enemies position 
function update() {
    if (gameOver) return; // Stop updating if game is over

    if (keys.KeyW) player.y -= player.speed;
    if (keys.KeyS) player.y += player.speed;
    if (keys.KeyA) player.x -= player.speed;
    if (keys.KeyD) player.x += player.speed;

    // Ensure player stays within canvas bounds
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

    // Enemies follow the player
    enemies.forEach(enemy => {
        if (enemy.active) {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                enemy.x += (dx / distance) * enemy.speed;
                enemy.y += (dy / distance) * enemy.speed;
            }
        }
    });
    
    // Kill enemies when E is pressed
    if (keys.KeyE) {
        enemies.forEach(enemy => {
            if (enemy.active) {
                const dx = player.x - enemy.x;
                const dy = player.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < player.radius + enemy.radius) {
                    enemy.active = false; // Deactivate the enemy
                    score += 1; // Increments score
                }
            }
        });
    }

    // Reset enemies when R is pressed
    if (keys.KeyR) {
        resetEnemies();
        score = 0; // Optionally reset score when enemies are reset
    }

    // Check for collision between player and enemies
    enemies.forEach(enemy => {
        if (enemy.active) {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < player.radius + enemy.radius) {
                gameOver = true; // Set game over flag
            }
        }
    });

    // Check if all enemies are killed
    if (enemies.every(enemy =>!enemy.active)) {
        gameWon = true; 
    }
}

// Draw player, enemies, score and game state
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw background color
    ctx.fillStyle = '#f0f0f0'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player as a circle
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();

    // Draw active enemies
    enemies.forEach(enemy => {
        if (enemy.active) {
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
            ctx.fillStyle = enemy.color;
            ctx.fill();
            ctx.closePath();
        }
    });

    // Draw the score in the top-right corner
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + score, canvas.width - 20, 20);

    // Draw game over/game won screen
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = '24px Arial';
        ctx.fillText('Click here to Retry', canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 100);
    } else if (gameWon) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '48px Arial';
        ctx.fillText('You Won!', canvas.width / 2, canvas.height / 2 - 80);

        ctx.font = '24px Arial';
        ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText('Click here to Retry', canvas.width / 2, canvas.height / 2 + 10);
        }
    }

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Repeat the loop
}

// Start game loop
gameLoop();



// //Version 1.2 - WASD keys
// //canvas element and context
// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');

// //player properties 
// const player = {
//     x: canvas.width / 2,
//     y: canvas.height / 2,
//     radius: 25,
//     speed: 7, 
//     color: 'purple'
// };

// //initial enemy positions
// const initialEnemyPositions = [
//     { x: canvas.width / 4, y: canvas.height / 4 },   //enemy1
//     { x: (canvas.width / 4) * 3, y: (canvas.height / 4) * 3 } //enemy2
// ];

// //enemy properties
// const enemies = [
//     {
//         x: initialEnemyPositions[0].x,
//         y: initialEnemyPositions[0].y,
//         radius: 20,
//         speed: 2,
//         color: 'red',
//         active: true //whether the enemy is active
//     },
//     {
//         x: initialEnemyPositions[1].x,
//         y: initialEnemyPositions[1].y,
//         radius: 20,
//         speed: 2,
//         color: 'green',
//         active: true //whether the enemy is active
//     }
// ];

// //score variable
// let score = 0;

// //game state
// let gameOver = false;

// //keyboard input
// const keys = {
//     KeyW: false, //up
//     KeyA: false, //right
//     KeyS: false, //down
//     KeyD: false, //left
//     KeyE: false, //attack 
//     KeyR: false, //reset enemies
// };

// document.addEventListener('keydown', (event) => {
//     if (keys.hasOwnProperty(event.code)) {
//         keys[event.code] = true;
//     }
// });

// document.addEventListener('keyup', (event) => {
//     if (keys.hasOwnProperty(event.code)) {
//         keys[event.code] = false;
//     }
// });

// //game over screen
// document.addEventListener('click', (event) => {
//     if (gameOver) {
//         const x = event.clientX - canvas.offsetLeft;
//         const y = event.clientY - canvas.offsetTop;

//         //check if click is on retry button
//         if (x > canvas.width / 2 - 50 && x < canvas.width / 2 + 50 && y > canvas.height / 2 - 30 && y < canvas.height / 2) {
//             //restart game
//                 resetGame();
//         }

//         //check if click is on quit button
//         if (x > canvas.width / 2 - 50 && x < canvas.width / 2 + 50 && y > canvas.height / 2 + 10 && y < canvas.height / 2 + 40) {
//             //quit game
//             location.reload();   
//         }
//     }
// })

// //reset game function 
// function resetGame() {
//     //reset player position
//     player.x = canvas.width / 2;
//     player.y = canvas.height / 2; 

//     //reset enemies
//     resetEnemies(); 

//     //reset score
//     score = 0; 

//     //reset game over flag
//     gameOver = false;
// }

// //reset enemies function
// function resetEnemies() {
//     enemies.forEach((enemy, index) => {
//         enemy.x = initialEnemyPositions[index].x;
//         enemy.y = initialEnemyPositions[index].y;
//         enemy.active = true;
//     });
// }

// //update player and enemy position 
// function update() {
//     if (gameOver) return; //stop updating score if game is over

//     if (keys.KeyW) player.y -= player.speed;
//     if (keys.KeyS) player.y += player.speed;
//     if (keys.KeyA) player.x -= player.speed;
//     if (keys.KeyD) player.x += player.speed;

//     //ensure player stays within canvas bounds
//     player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
//     player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

// //enemies follow the player
// enemies.forEach(enemy => {
//     if (enemy.active) {
//         const dx = player.x - enemy.x;
//         const dy = player.y - enemy.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance > 0) {
//             enemy.x += (dx / distance) * enemy.speed;
//             enemy.y += (dy / distance) * enemy.speed;
//         }
//     }
// });
    
//  //kill enemies when E is pressed
//     if (keys.KeyE) {
//         enemies.forEach(enemy => {
//             if (enemy.active) {
//                 const dx = player.x - enemy.x;
//                 const dy = player.y - enemy.y;
//                 const distance = Math.sqrt(dx * dx + dy * dy);

//                 if (distance < player.radius + enemy.radius) {
//                     enemy.active = false; //attack the enemy
//                     score += 1; //score goes up
//                 }
//             }
//         });
//     }

//     //reset enemies when R is pressed
//     if (keys.KeyR) {
//         resetEnemies();
//         score = 0; //resets score
//     }

//     //check for collision between player and enemies
//     enemies.forEach(enemies => {
//         if(enemy.active) {
//             const dx = player.x - enemy.x;
//             const dy = player.y - enemy.y;
//             const distance = Math.sqrt(dx * dx + dx * dy);

//             if (distance < player.radius + enemy.radius) {
//                 gameOver = true; //set game over flag
//             }
//         }
//     })
//     }

// //draw player and enemies on the canvas
// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas

//     //draw background color
//     ctx.fillStyle = '#f0f0f0'; //background color
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     //draw player as a circle
//     ctx.beginPath();
//     ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
//     ctx.fillStyle = player.color;
//     ctx.fill();
//     ctx.closePath();

//     //draw active enemies
//     enemies.forEach(enemy => {
//         if (enemy.active) {
//             ctx.beginPath();
//             ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
//             ctx.fillStyle = enemy.color;
//             ctx.fill();
//             ctx.closePath();
//         }
//     });

//     //scoreboard
//     ctx.font = '24px Arial';
//     ctx.fillStyle = 'black';
//     ctx.textAlign = 'right';
//     ctx.ctxtextBaseline = 'top';
//     ctx.fillText('Score: ' + score, canvas.width - 20, 20);

//       // Draw game over screen if game is over
//       if (gameOver) {
//         ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         ctx.fillStyle = 'white';
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';
//         ctx.font = '48px Arial';
//         ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);

//         ctx.font = '24px Arial';
//         ctx.fillText('Click here to Retry', canvas.width / 2, canvas.height / 2 + 10);
//         ctx.fillText('Click here to Quit', canvas.width / 2, canvas.height / 2 + 40);
//     }
// }

// //main game loop
// function gameLoop() {
//     update();
//     draw();
//     requestAnimationFrame(gameLoop); //repeat the loop
// }

// //start game loop
// gameLoop();






















































// //Version 1.0 - arrow keys
// //canvas element and context
// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');

// //player properties 
// const player = {
//     x: canvas.width / 2,
//     y: canvas.height / 2,
//     radius: 25,
//     speed: 5, 
//     color: 'purple'
// };

// //keyboard input 

// const keys = {
//     KeyW: false,
//     KeyA: false,
//     KeyS: false,
//     KeyD: false
// }; 

// document.addEventListener('keydown', (event) => {
//     if (keys.hasOwnProperty(event.code)) {
//         keys[event.code] = true;
//     }
// });

// document.addEventListener('keyup', (event) => {
//     if (keys.hasOwnProperty(event.code)) {
//         keys[event.code] = false;
//     }
// });

// //update player position based on key input
// function update() {
//     if (keys.KeyW) player.y -= player.speed;
//     if (keys.KeyS) player.y += player.speed;
//     if (keys.KeyA) player.x -= player.speed;
//     if (keys.KeyD) player.x += player.speed;

//     //ensure player stays within canvas bounds
//     player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
//     player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
// }

// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

//     //draw background color
//     ctx.fillStyle = '#f0f0f0'; // Background color
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     //draw player as a circle
//     ctx.beginPath();
//     ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2); // Circle: (x, y, radius, startAngle, endAngle)
//     ctx.fillStyle = player.color; // Set circle color
//     ctx.fill(); // Fill the circle
//     ctx.closePath();
// }

// //main game loop
// function gameLoop() {
//     update();
//     draw();
//     requestAnimationFrame(gameLoop); // Repeat the loop
// }

// // Start the game loop
// gameLoop();d

