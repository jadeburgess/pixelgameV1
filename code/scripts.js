
//Version 1.2 - WASD keys
//canvas element and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//player properties 
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 25,
    speed: 7, 
    color: 'purple'
};

//initial enemy positions
const initialEnemyPositions = [
    { x: canvas.width / 4, y: canvas.height / 4 },   // First enemy
    { x: (canvas.width / 4) * 3, y: (canvas.height / 4) * 3 } // Second enemy
];

//enemy properties
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


//keyboard input
const keys = {
    KeyW: false, //up
    KeyA: false, //right
    KeyS: false, //down
    KeyD: false, //left
    KeyE: false, //attack 
    KeyR: false, //reset enemies
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

//reset enemies function
function resetEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x = initialEnemyPositions[index].x;
        enemy.y = initialEnemyPositions[index].y;
        enemy.active = true;
    });
}

//update player and enemy position 
function update() {
    if (keys.KeyW) player.y -= player.speed;
    if (keys.KeyS) player.y += player.speed;
    if (keys.KeyA) player.x -= player.speed;
    if (keys.KeyD) player.x += player.speed;

    //ensure player stays within canvas bounds
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

                // Assuming the player must be close enough to kill the enemy
                if (distance < player.radius + enemy.radius) {
                    enemy.active = false; // Deactivate the enemy
                }
            }
        });
    }

    // Reset enemies when R is pressed
    if (keys.KeyR) {
        resetEnemies();
    }
    }


// Draw player and enemies on the canvas
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
}


//main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); //repeat the loop
}

//start game loop
gameLoop();





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

