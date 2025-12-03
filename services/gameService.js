import sequelize from '../models/index.js'
import { Sequelize } from 'sequelize'
import ScratchGame from '../models/scratch_game.js'
import User from '../models/user.js'
import ScratchGameMove from '../models/scratch_game_move.js'
import e from 'express'

const processMove = async (gameId, box_number, userId) => {
  try {
    return await sequelize.transaction(async t => {
      console.log('Processing move:', { gameId, box_number, userId })
      const game = await ScratchGame.findByPk(gameId, { transaction: t })
      if (!game) {
        return {
          success: false,
          message: 'Game not found'
        }
      }

      const is_winner = box_number === game.winner_box_number
      const savedMove = await ScratchGameMove.create(
        {
          game_id: gameId,
          user_id: userId,
          box_number: box_number,
          is_winner: is_winner || false
        },
        { transaction: t }
      )

      if (!is_winner) {
        return {
          success: true,
          message: 'Move recorded, game continues',
          data: {
            gameFinished: false,
            move: {
              gameId,
              box_number,
              userId,
              moveId: savedMove.id
            }
          }
        }
      }
      const winnerId = userId
      const loserId = game.user1_id === userId ? game.user2_id : game.user1_id

      const entryFee = parseFloat(game.game_amount)
      const winner = await User.findByPk(winnerId, { transaction: t })
      const loser = await User.findByPk(loserId, { transaction: t })
      const loserBalance = parseFloat(loser.balance)
      const winnerBalance = parseFloat(winner.balance)

      if (loserBalance < entryFee) {
        return {
          success: false,
          message: 'Loser has insufficient balance'
        }
        // throw new Error('Loser has insufficient balance')
      }

      loser.balance = (loserBalance - entryFee).toFixed(2)
      winner.balance = (winnerBalance + entryFee).toFixed(2)

      await loser.save({ transaction: t })
      await winner.save({ transaction: t })

      game.status = 'completed'
      game.winner_id = winnerId
      await game.save({ transaction: t })

      return {
        success: true,
        message: `User ${winner.first_name} won the game and received ${entryFee} units.`,
        data: {
          gameFinished: true,
          gameResult: {
            winnerId,
            loserId,
            message :  `User ${winner.first_name} won the game and received ${entryFee} units.`
          },
          move: {
            gameId,
            box_number,
            userId,
            moveId: savedMove.id
          }
        }
      }
    })
  } catch (error) {
    console.error('Error in processMove:', error)
    return {
      success: false,
      message: error.message
    }
    //throw error
  }
}
const leaveGameRoom = async (gameId, userId) => {
  try {
    return await sequelize.transaction(async t => {
      const game = await ScratchGame.findByPk(gameId, { transaction: t })
      if (!game) {
        return {
          success: false,
          message: 'Game not found'
        }
        // throw new Error('Game not found')
      }

      const loserId = userId
      const winnerId = game.user1_id === userId ? game.user2_id : game.user1_id

      const entryFee = parseFloat(game.game_amount)
      const winner = await User.findByPk(winnerId, { transaction: t })
      const loser = await User.findByPk(loserId, { transaction: t })

      const loserBalance = parseFloat(loser.balance)
      const winnerBalance = parseFloat(winner.balance)
      if (loserBalance < entryFee) {
        return {
          success: false,
          message: 'Loser has insufficient balance'
        }
        // throw new Error('Loser has insufficient balance')
      }

      loser.balance = (loserBalance - entryFee).toFixed(2)
      winner.balance = (winnerBalance + entryFee).toFixed(2)

      await loser.save({ transaction: t })
      await winner.save({ transaction: t })

      game.status = 'leaved'
      game.leave_user_id = userId
      game.winner_id = winnerId
      await game.save({ transaction: t })
      return {
        success: true,
        message: `User ${winner.first_name} won the game as User ${loser.first_name} left and received ${entryFee} units.`,
        data: {
          gameFinished: true,
          gameResult: {
            winnerId,
            loserId,
            message : `User ${winner.first_name} won the game as User ${loser.first_name} left and received ${entryFee} units.`
          }
        }
      }
    })
  } catch (error) {
    console.error('Error in leaveGameRoom:', error)
    return {
      success: false,
      message: error.message
    }
    // throw error
  }
}

const cancelGame = async (gameId, userId) => {
  try {
    return await sequelize.transaction(async t => {
      const game = await ScratchGame.findByPk(gameId, { transaction: t })
      if (!game) {
        return {
          success: false,
          message: 'Game not found'
        }
        // throw new Error('Game not found')
      }
      if (game.user1_id !== userId) {
        return {
          success: false,
          message: 'Only the game creator can cancel the game'
        }
        // throw new Error('Only the game creator can cancel the game')
      }
      game.status = 'cancelled'
      await game.save({ transaction: t })
      return {
        success: true,
        message: 'Game is cancelled by the owner',
        data: {
          gameFinished: true,
          message : 'Game is cancelled by the owner'
        }
      }
    })
  } catch (error) {
    console.error('Error in cancelGame:', error)
    return {
      success: false,
      message: error.message
    }
    // throw error
  }
}

const startGame = async (gameId, userId) => {
  try {
    return await sequelize.transaction(async t => {
      const game = await ScratchGame.findByPk(gameId, { transaction: t })
      if (!game) {
        return {
          success: false,
          message: 'Game not found'
        }
        //throw new Error('Game not found')
      }
      if (game.user1_id !== userId) {
        return {
          success: false,
          message: 'Only the game creator can start the game'
        }
        // throw new Error('Only the game creator can start the game')
      }

      if (!game.user2_id) {
        return {
          success: false,
          message: 'Cannot start game without a second player'
        }
        // throw new Error('Cannot start game without a second player')
      }

      const players = [game.user1_id, game.user2_id];
      const firstTurn = players[Math.floor(Math.random() * players.length)];

      const firstTurnUser = await User.findByPk(firstTurn, { transaction: t });

      game.status = 'active';
      await game.save({ transaction: t });

      return {
        success: true,
        message: `Game ${gameId} started. User ${firstTurnUser.first_name} will make the first move.`,
        data: {
          gameId,
          firstTurn,
          message : `Game ${gameId} started. User ${firstTurnUser.first_name} will make the first move.`,
          firstTurnUser: {
            id: firstTurnUser.id,
            name: firstTurnUser.first_name
          }
        }
      };
    })
  } catch (error) {
    console.error('Error in startGame:', error)
    return {
      success: false,
      message: error.message
    }
  }
}

export default { processMove, leaveGameRoom, cancelGame, startGame }
