import { DataTypes } from "sequelize";
import sequelize from "./index.js"; // Add `.js` for ES Modules

const User = sequelize.define('User', {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Usually emails should be unique
    validate: {
      isEmail: true, // Ensures valid email format
    },
  },
  email_verified_at: {
    type: DataTypes.DATE, // ✅ Use DATE instead of TIMESTAMP
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users', // Optional: specify table name
  timestamps: true,   // ✅ Enables createdAt and updatedAt automatically
  underscored: true,  // Maps to `created_at` and `updated_at` instead of camelCase
});

export default User;
