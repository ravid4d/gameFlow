const chatSocket = (io, socket) => {
  socket.on('chat message', msg => {
    console.log('Message:', msg)
    io.emit('chat message', msg) // Broadcast to all clients
  });

  socket.on('gameSendMessage', data => {
    try
    {
      const {gameId,userId,message} = data;
      if(!gameId || !userId || !message)
      {
        return socket.emit("gameChatError", {
          success : false,
          message : "Missing parameters"
        });
      }

      const roomName = `game_${gameId}`

      socket.to(roomName).emit('gameRecievedMessage',{
        gameId,userId,message,timestamp : new Date
      });
    }
    catch(error)
    {

    }
  });
}

export default chatSocket
