import ScratchGameMove from '../models/scratch_game_move.js';

const gameSocket = (io, socket) => {
  socket.on('joinGameRoom', gameId => {
    const roomName = `game_${gameId}`
    socket.join(roomName)
    console.log(`Socket ${socket.id} joined room ${roomName}`);
  });

  socket.on('playerMove', async (data) => {
    try {
      const { gameId, box_number,userId , is_winner} = data;
      const roomName = `game_${gameId}`;

      // ✅ Save move in DB
      const savedMove = await ScratchGameMove.create({
        game_id: gameId,
        user_id: userId,
        box_number: box_number,
        is_winner: is_winner || false,
      });

    console.log(`Move saved for game ${gameId}`);
    console.log(gameId);
      // 📡 Notify both players in the same room
      io.to(roomName).emit('moveMade', { gameId, box_number, userId, moveId: savedMove.id });

    } catch (error) {
      console.error('Error saving move:', error);
      socket.emit('error', { message: 'Failed to save move' });
    }
  });

    
}

export default gameSocket;