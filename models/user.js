import { DataTypes } from "sequelize";
import sequelize from "./index.js"; // Assuming this exports the Sequelize instance

const User = sequelize.define('User', {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY, // DATEONLY if you don't care about time
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING, // ✅ Use STRING instead of NUMBER
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  email_verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

export default User;