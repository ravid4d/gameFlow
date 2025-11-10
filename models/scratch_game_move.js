import { DataTypes,Model } from "sequelize";
import sequelize from './index.js'; // your sequelize instance
import User from "./user.js";
import ScratchGame from "./scratch_game.js";

class ScratchGameMove extends Model {}      

ScratchGameMove.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      box_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_winner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ScratchGameMove',
      tableName: 'scratch_game_moves',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )
  ScratchGameMove.belongsTo(ScratchGame, { foreignKey: "game_id", as: "game" });
  ScratchGameMove.belongsTo(User, { foreignKey: "user_id", as: "player" });

  export default ScratchGameMove;