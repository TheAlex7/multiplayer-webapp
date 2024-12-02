const socket = io(); // Connect to the Flask-SocketIO backend

// Player elements
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');

// Initial position for this player
let x = 0;
let y = 0;
const step = 20;
let myRole = null; // Role for this client (player1 or player2)

// Track keys currently pressed
const keysPressed = new Set();

// Move the local player
function movePlayer() {
    if (!myRole) return; // Wait until role is assigned

    if (keysPressed.has('ArrowUp')) y = Math.max(0, y - step);
    if (keysPressed.has('ArrowDown')) y = Math.min(350, y + step); // Adjust bounds as needed
    if (keysPressed.has('ArrowLeft')) x = Math.max(0, x - step);
    if (keysPressed.has('ArrowRight')) x = Math.min(350, x + step);

    // Update local player's position
    const currentPlayer = myRole === 'player1' ? player1 : player2;
    currentPlayer.style.left = `${x}px`;
    currentPlayer.style.top = `${y}px`;

    // Send position to the server
    socket.emit('update_position', { player: myRole, x, y });
}

// Handle keydown and keyup events
document.addEventListener('keydown', (e) => {keysPressed.add(e.key);});
document.addEventListener('keyup', (e) => keysPressed.delete(e.key));

// Periodically update position
setInterval(movePlayer, 50);

document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === "Enter"){
        const input = document.getElementById('message-input');
        const message = input.value;
        if (message) {
            socket.emit('msg2',message);
            input.value = ''; // Clear the input field
        }
    }
});

document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === "Enter"){
        const input = document.getElementById('user-input');
        const message = input.value;
        if (message) {
            socket.emit('update_username',message);
            input.value = ''; // Clear the input field
        }
    }
});

// socket related functions
socket.on('message', (msg) => {
    console.log(`Received message: ${msg}`); // Log the received message
    const messages = document.getElementById('messages');
    messages.innerHTML += `<p>${msg}</p>`;
});

// Listen for role assignment
socket.on('assign_role', (data) => {
    myRole = data.role;
    console.log(`Assigned role: ${myRole}`);
});

// Handle position updates from the server
socket.on('position_update', (positions) => {
    if (positions.player1) {
        player1.style.left = `${positions.player1.x}px`;
        player1.style.top = `${positions.player1.y}px`;
    }
    if (positions.player2) {
        player2.style.left = `${positions.player2.x}px`;
        player2.style.top = `${positions.player2.y}px`;
    }
});

// Handle full room
socket.on('full_room', () => {
    alert('The game is full. Please try again later.');
});

socket.on('msg2', (msg) => {
    console.log(`Rec msg 2: ${msg}`);
    const messages = document.getElementById('chat-box');
    messages.innerHTML += `<p>${msg}</p>`;
})

socket.on('movePos', (dir) => {
    console.log(`Moving: ${dir}`);
    const square = document.getElementById('square');
    square += `<p>${msg}</p>`;
})