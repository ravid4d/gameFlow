import db from '../models/index.js'

const processMove = async (gameId, box_number, userId, is_winner) => {
  return await db.sequelieze.transaction(async t => {
    const game = await db.ScratchGame.findByPk(gameId, { transaction: t })
    if (!game) {
      throw new Error('Game not found')
    }

    const savedMove = await db.ScratchGameMove.create(
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

    const entryFee = game.entry_fee
    const winner = await db.User.findByPk(winnerId, { transaction: t })
    const loser = await db.User.findByPk(loserId, { transaction: t })

    if (loser.balance < entryFee) {
      throw new Error('Loser has insufficient balance')
    }

    loser.wallet_balance -= entryFee
    winner.wallet_balance += entryFee

    await loser.save({ transaction: t })
    await winner.save({ transaction: t })

    game.status = 'completed'
    game.winner_id = winnerId
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
  return await db.sequelieze.transaction(async t => {
    const game = await db.ScratchGame.findByPk(gameId, { transaction: t })  
    if (!game) {
      throw new Error('Game not found')
    }   

    const loserId = userId;
    const winnerId = game.user1_id === userId ? game.user2_id : game.user1_id;

    const entryFee = game.entry_fee
    const winner = await db.User.findByPk(winnerId, { transaction: t })
    const loser = await db.User.findByPk(loserId, { transaction: t })

    if (loser.balance < entryFee) {
      throw new Error('Loser has insufficient balance')
    }

    loser.wallet_balance -= entryFee
    winner.wallet_balance += entryFee

    await loser.save({ transaction: t })
    await winner.save({ transaction: t })

    game.status = 'leaved';
    game.leave_user_id = userId;
    game.winner_id = winnerId;
    await game.save({ transaction: t })
87 
    return { message: `User ${userId} left the game ${gameId}. Game marked as abandoned.` }
  });
  
}

export default { processMove }
