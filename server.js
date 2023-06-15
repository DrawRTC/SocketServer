const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const PORT = 8083;

const { Server } = require('socket.io');

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// <---- SOCKET CONNECTION ---->
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  socket.on('client-ready', () => {
    socket.broadcast.emit('get-canvas-state');
  });

  socket.on('canvas-state', (state) => {
    console.log('received canvas state');
    socket.broadcast.emit('canvas-state-from-server', state);
  });

  socket.on('draw-line', ({ prevPoint, currentPoint, color }) => {
    socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color });
  });

  socket.on('clear', () => io.emit('clear'));
});

// STARTING SERVER  
server.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
