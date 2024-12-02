from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room

# Initialize Flask and SocketIO
app = Flask(__name__)
socketio = SocketIO(app)

# Dictionary to store player positions

# Keep track of connected players and their roles
players = {}  # Dictionary mapping socket IDs to roles (e.g., "player1", "player2")
usernames = dict()
# Route for the home page
@app.route('/')
def home():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    # Assign role based on current connections
    if len(players) == 0:
        players[request.sid] = 'player1'
        usernames[request.sid] = 'Player 1'
    elif len(players) == 1:
        players[request.sid] = 'player2'
        usernames[request.sid] = 'Player 2'
    else:
        emit('full_room')  # Notify if the game is full
        return

    role = players[request.sid]
    emit('assign_role', {'role': role})
    print(f"{role} connected (Socket ID: {request.sid})")

# Handle disconnection
@socketio.on('disconnect')
def handle_disconnect():
    if request.sid in players:
        print(f"{players[request.sid]} disconnected (Socket ID: {request.sid})")
        del players[request.sid]

# WebSocket event for receiving messages
@socketio.on('message')
def handle_message(msg):
    print(f"Received message: {msg}")
    send(f"Server received: {msg}", broadcast=True)

@socketio.on('msg2')
def handle_message2(msg):
    print(f"Rec'd message: {msg}")
    if request.sid not in usernames:
        send(f"Anonymous: {msg}", broadcast=True)
    else:
        send(f"{usernames[request.sid]}: {msg}", broadcast=True)

# Update player position
@socketio.on('update_position')
def handle_update_position(data):
    player = data['player']
    x, y = data['x'], data['y']

    # Broadcast position to all clients
    socketio.emit('position_update', {player: {"x": x, "y": y}})

@socketio.on("update_username")
def handle_username_change(name):
    usernames[request.sid] = name

if __name__ == '__main__':
    # Start the Flask app with SocketIO
    socketio.run(app, debug=True)
