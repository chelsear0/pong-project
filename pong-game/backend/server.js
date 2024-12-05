const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let ballPosition = { x: 400, y: 300 };

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send initial ball position
  socket.emit('ballUpdate', ballPosition);

  // Update ball position every second (example)
  setInterval(() => {
    ballPosition.x += Math.random() > 0.5 ? 5 : -5;
    ballPosition.y += Math.random() > 0.5 ? 5 : -5;
    io.emit('ballUpdate', ballPosition);
  }, 1000);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
