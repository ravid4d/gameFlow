import sequelize from '../models/index.js'
import { Sequelize } from 'sequelize';
import ScratchGame from '../models/scratch_game.js'
import User from '../models/user.js'
import ScratchGameMove from '../models/scratch_game_move.js'

const processMove = async (gameId, box_number, userId, is_winner) => {
  return await sequelize.transaction(async t => {
    console.log('Processing move:', { gameId, box_number, userId, is_winner });
    const game = await  ScratchGame.findByPk(gameId, { transaction: t })
    if (!game) {
      throw new Error('Game not found')
    }

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
        move: {
          gameId,
          box_number,
          userId,
          moveId: savedMove.id
        },
        gameFinished: false
      }
    }
    const winnerId = userId
    const loserId = game.user1_id === userId ? game.user2_id : game.user1_id

    const entryFee = parseFloat(game.game_amount);
    const winner = await User.findByPk(winnerId, { transaction: t });
    const loser = await User.findByPk(loserId, { transaction: t });
    const loserBalance = parseFloat(loser.balance);
    const winnerBalance = parseFloat(winner.balance);

    if (loserBalance < entryFee) {
      throw new Error('Loser has insufficient balance')
    }

    loser.balance = (loserBalance - entryFee).toFixed(2);
    winner.balance = (winnerBalance + entryFee).toFixed(2);

    await loser.save({ transaction: t })
    await winner.save({ transaction: t })

    game.status = 'completed';
    game.winner_id = winnerId;
    await game.save({ transaction: t })

    return {
      move: {
        gameId,
        box_number,
        userId,
        moveId: savedMove.id
      },
      gameFinished: true,
      gameResult: {
        winnerId,
        loserId,
        message: `User ${winnerId} won the game and received ${entryFee} units.`
      }
    }
  })
}
const leaveGameRoom = async (gameId, userId) => {
  return await sequelize.transaction(async t => {
    const game = await ScratchGame.findByPk(gameId, { transaction: t })  
    if (!game) {
      throw new Error('Game not found')
    }   

    const loserId = userId;
    const winnerId = game.user1_id === userId ? game.user2_id : game.user1_id;

    const entryFee = parseFloat(game.game_amount);
    const winner = await User.findByPk(winnerId, { transaction: t })
    const loser = await User.findByPk(loserId, { transaction: t })

    const loserBalance = parseFloat(loser.balance);
    const winnerBalance = parseFloat(winner.balance);
    if (loserBalance < entryFee) {
      throw new Error('Loser has insufficient balance')
    }

    loser.balance = (loserBalance - entryFee).toFixed(2);
    winner.balance = (winnerBalance + entryFee).toFixed(2);

    await loser.save({ transaction: t })
    await winner.save({ transaction: t })

    game.status = 'leaved';
    game.leave_user_id = userId;
    game.winner_id = winnerId;
    await game.save({ transaction: t })
     return {
      gameFinished: true,
      gameResult: {
        winnerId,
        loserId,
        message: `User ${userId} left the game ${gameId}. Game marked as leaved.`
      }
    };
  });
}

export default { processMove,leaveGameRoom }
