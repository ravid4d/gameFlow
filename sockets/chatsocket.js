const chatSocket = (io, socket) => {
  socket.on('chat message', msg => {
    console.log('Message:', msg)
    io.emit('chat message', msg) // Broadcast to all clients
  });
}

export default chatSocket
