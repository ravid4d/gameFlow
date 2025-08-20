import { DataTypes, Model } from 'sequelize';
import sequelize from './index.js'; // your sequelize instance
import User from './user.js'; // assuming you have a User model defined

class ScratchGame extends Model {}

ScratchGame.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user2_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('waiting', 'active', 'completed', 'leaved', 'cancelled'),
    allowNull: false,
    defaultValue: 'waiting',
  },
  game_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  leave_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ScratchGame',
  tableName: 'scratch_games',
  underscored: true,
  timestamps: true,
});
ScratchGame.belongsTo(User, { foreignKey: "user1_id", as: "createdBy" });
ScratchGame.belongsTo(User, { foreignKey: "user2_id", as: "joinedBy" });
export default ScratchGame;

