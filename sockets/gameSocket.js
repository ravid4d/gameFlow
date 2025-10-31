const gameSocket = (io, socket) => {
  socket.on('joinGameRoom', gameId => {
    const roomName = `game_${gameId}`
    socket.join(roomName)
    console.log(`Socket ${socket.id} joined room ${roomName}`);
  });

  socket.on('playerMove', async (data) => {
    try {
      const { gameId, move } = data;
      const roomName = `game_${gameId}`;

      // ✅ Save move in DB
    //   const savedMove = await GameMove.create({
    //     game_id: gameId,
    //     move_data: JSON.stringify(move),
    //     made_by: socket.id,
    //   });

    console.log(`Move saved for game ${gameId}`);
    console.log(gameId);
      // 📡 Notify both players in the same room
      io.to(roomName).emit('moveMade', { gameId, move });

    } catch (error) {
      console.error('Error saving move:', error);
      socket.emit('error', { message: 'Failed to save move' });
    }
  });

    
}

export default gameSocket;