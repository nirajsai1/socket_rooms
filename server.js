const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

const PORT = 3002;
const rooms = {}; // Store room data

app.use(cors());

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('create_room', (roomcode) => {
    if (!rooms[roomcode]) {
      rooms[roomcode] = { players: [socket.id], choices: {} };
      socket.join(roomcode);
      console.log(`Room ${roomcode} created.`);
    }
  });

  socket.on('join_room', (roomcode) => {
    if (rooms[roomcode]) {
      if (rooms[roomcode].players.length < 2) {
        rooms[roomcode].players.push(socket.id);
        socket.join(roomcode);
        console.log(`User ${socket.id} joined room ${roomcode}`);
        io.to(roomcode).emit('room_status', true);

        if (rooms[roomcode].players.length === 2) {
          io.to(roomcode).emit('start_game', 'Game starting now!');
        }
      } else {
        socket.emit('room_status', false);
      }
    } else {
      socket.emit('room_status', false);
    }
  });

  socket.on('player_choice', ({ roomcode, choice }) => {
    if (rooms[roomcode]) {
      rooms[roomcode].choices[socket.id] = choice;

      console.log(`Player ${socket.id} chose ${choice} in room ${roomcode}`);

      if (Object.keys(rooms[roomcode].choices).length === 2) {
        const [player1, player2] = rooms[roomcode].players;
        const choice1 = rooms[roomcode].choices[player1];
        const choice2 = rooms[roomcode].choices[player2];

        console.log(`Choices in room ${roomcode}:`, choice1, choice2);

        const result = determineWinner(choice1, choice2);

        io.to(player1).emit('result', { result, yourChoice: choice1, opponentChoice: choice2 });
        io.to(player2).emit('result', { result, yourChoice: choice2, opponentChoice: choice1 });

        // Reset choices for the next round
        rooms[roomcode].choices = {};
      }
    }
  });

  socket.on('disconnect', () => {
    for (const roomcode in rooms) {
      const room = rooms[roomcode];
      const index = room.players.indexOf(socket.id);
      if (index !== -1) {
        room.players.splice(index, 1);
        delete room.choices[socket.id];
        if (room.players.length === 0) {
          delete rooms[roomcode];
        }
        break;
      }
    }
    console.log(`User ${socket.id} disconnected.`);
  });

  const determineWinner = (choice1, choice2) => {
    if (choice1 === choice2) return "It's a tie!";
    if (
      (choice1 === 'rock' && choice2 === 'scissors') ||
      (choice1 === 'scissors' && choice2 === 'paper') ||
      (choice1 === 'paper' && choice2 === 'rock')
    ) {
      return "Player 1 wins!";
    }
    return "Player 2 wins!";
  };
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
