import ScratchGame from '../../models/scratch_game.js'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { createGameList,updateGameList } from '../../sockets/utils/socketEmitter.js';

export const listGames = async (req, res) => {
  try {
    const games = await ScratchGame.findAll({
      where: {
        status: 'waiting',
        user1_id: { [Op.ne]: req.user.id }
      },
      order: [['createdAt', 'DESC']]
    })

    return res.status(200).json({
      success: true,
      message: 'Games fetched successfully',
      data: games
    })
  } catch (error) {
    console.error('Error fetching games:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: []
    })
  }
}

export const createGame = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const message = errors.array().map(err => err.msg).join(', ');

    return res.status(200).json({
      success: false,
      message: message,
      data: []
    });
  }

  try {
    const title = req.body.title
    const user1_id = req.user.id // Assuming user ID is available in req.userconst
    const game_amount = req.body.game_amount
    const total_amount = game_amount * 2 // Assuming both players contribute equally
    const status = 'waiting'
    const newGame = await ScratchGame.create({
      title: title,
      user1_id: user1_id,
      game_amount: game_amount,
      total_amount: total_amount,
      status: status
    });
    createGameList('gameListUpdated', newGame); // Emit event to update game list
    return res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: newGame
    })
  } catch (error) {
    console.error('Error creating game:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: []
    })
  }
}

export const joinGame = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
   const message = errors.array().map(err => err.msg).join(', ');

    return res.status(200).json({
      success: false,
      message: message,
      data: []
    });
  }

  try {
    const gameId = req.params.id
    const user2_id = req.user.id // Assuming user ID is available in req.user

    const game = await ScratchGame.findByPk(gameId)
    if (!game) {
      return res.status(200).json({
        success: false,
        message: 'Game not found',
        data: []
      })
    }

    if (game.status !== 'waiting') {
      return res.status(200).json({
        success: false,
        message: 'Game is not available for joining',
        data: []
      })
    }

    game.user2_id = user2_id;
    game.status = 'active';
    await game.save();
    updateGameList('gameRemovedFromList', game); 
    return res.status(200).json({
      success: true,
      message: 'Joined game successfully',
      data: game
    })
  } catch (error) {
    console.error('Error joining game:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: []
    })
  }
}
