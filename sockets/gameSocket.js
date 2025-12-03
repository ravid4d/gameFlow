import ScratchGameMove from '../models/scratch_game_move.js'
import gameService from '../services/gameService.js'

const gameSocket = (io, socket) => {
  socket.on('joinGameRoom', gameId => {
    const roomName = `game_${gameId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room ${roomName}`);
  })

  socket.on('startGame', async data => {
    try {
      const roomName = `game_${data.gameId}`;
      const result = await gameService.startGame(data.gameId, data.userId);
      if (!result.success) {
        socket.emit('startGameError', { message: result.message });
        return;
      }
      io.to(roomName).emit('gameStarted', result.data);
      console.log(`Game started in room ${roomName}`);
    } catch (error) {
      console.error('Error starting game:', error);
      socket.emit('startGameError', { message: 'Failed to start game' });
    }
  })

  socket.on('playerMove', async data => {
    try {
      const { gameId, box_number, userId } = data
      const result = await gameService.processMove(gameId, box_number, userId);
      if (!result.success) {
        socket.emit('playerMoveError', { message: result.message });
        return;
      }
      console.log(`Move saved for game ${gameId}`);
      console.log(gameId);
      // 📡 Notify both players in the same room
      io.to(`game_${data.gameId}`).emit('moveMade', result.data.move);

      if (result.data.gameFinished) {
        io.to(`game_${data.gameId}`).emit('gameOver', result.data.gameResult);
      }
    } catch (error) {
      console.error('Error saving move:', error);
      socket.emit('playerMoveError', { message: 'Failed to save move' });
    }
  })

  socket.on('leaveGameRoom', async data => {
    try {
      const { gameId, userId } = data;
      const roomName = `game_${data.gameId}`;
      const result = await gameService.leaveGameRoom(gameId, userId);
      if (!result.success) {
        socket.emit('leaveGameRoomError', { message: result.message });
        return;
      }
      io.to(`game_${data.gameId}`).emit('gameOver', result.data.gameResult);
      socket.leave(roomName);
      console.log(`Socket ${socket.id} left room ${roomName}`);
    } catch (error) {
      console.error('Error leaving game room:', error);
      socket.emit('leaveGameRoomError', {message: 'Failed to leave game room'});
    }
  });

  socket.on('cancelGame', async data => {
    try {
      const { gameId, userId } = data
      const roomName = `game_${data.gameId}`
      const result = await gameService.cancelGame(gameId, userId)
      if (!result.success) {
        socket.emit('cancelGameError', { message: result.message });
        return;
      }
      io.to(`game_${data.gameId}`).emit('gameCancelled', result.data);
      socket.leave(roomName);
      console.log(`Socket ${socket.id} left room ${roomName}`)
    } catch (error) {
      console.error('Error cancelling game:', error)
      socket.emit('cancelGameError', { message: 'Failed to cancel game' });
    }
  });
}

export default gameSocket
