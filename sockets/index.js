import chatSocket from './chatsocket.js'
import gameSocket from './gameSocket.js';

const registerSockets = io => {
  io.on('connection', socket => {
    console.log('A user connected:', socket.id)
    
     chatSocket(io,socket);
     gameSocket(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}

export default registerSockets
