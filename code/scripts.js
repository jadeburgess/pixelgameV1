
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

//keyboard input
const keys = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false
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

//update player position based on key input
function update() {
    if (keys.KeyW) player.y -= player.speed;
    if (keys.KeyS) player.y += player.speed;
    if (keys.KeyA) player.x -= player.speed;
    if (keys.KeyD) player.x += player.speed;

    //ensure player stays within canvas bounds
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
}

//draw player on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas

    //draw background color
    ctx.fillStyle = '#f0f0f0'; //background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw player as a circle
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2); //circle: (x, y, radius, startAngle, endAngle)
    ctx.fillStyle = player.color; //set circle color
    ctx.fill(); //fill the circle
    ctx.closePath();
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

