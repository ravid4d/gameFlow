
const chatSocket = (io) => {
  io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for messages
  socket.on('chat message', (msg) => {
    console.log('Message:', msg);
    io.emit('chat message', msg); // Broadcast to all clients
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
};

export default chatSocket;