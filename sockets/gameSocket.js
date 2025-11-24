import ScratchGameMove from '../models/scratch_game_move.js'
import gameService from '../services/gameService.js'

const gameSocket = (io, socket) => {
  socket.on('joinGameRoom', gameId => {
    const roomName = `game_${gameId}`
    socket.join(roomName)
    console.log(`Socket ${socket.id} joined room ${roomName}`)
  })

  socket.on('playerMove', async data => {
    try {
      const { gameId, box_number, userId, is_winner } = data
      const result = await gameService.processMove(gameId, box_number, userId, is_winner);

      console.log(`Move saved for game ${gameId}`)
      console.log(gameId)
      // 📡 Notify both players in the same room
      io.to(`game_${data.gameId}`).emit('moveMade', result.move)

      if (result.gameFinished) {
        io.to(`game_${data.gameId}`).emit('gameOver', result.gameResult)
      }
    } catch (error) {
      console.error('Error saving move:', error)
      socket.emit('error', { message: 'Failed to save move' })
    }
  })

  socket.on('leaveGameRoom', async data => {
    try{
      const { gameId, userId } = data
    const roomName = `game_${data.gameId}`
    const result = await gameService.leaveGameRoom(gameId, userId);
    io.to(`game_${data.gameId}`).emit('gameOver', result.gameResult)
    socket.leave(roomName)
    console.log(`Socket ${socket.id} left room ${roomName}`)
    } catch (error) {
      console.error('Error leaving game room:', error)
      socket.emit('error', { message: 'Failed to leave game room' })
    }
  });
}

export default gameSocket
