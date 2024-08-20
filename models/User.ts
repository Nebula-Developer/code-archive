import sequelize from "../database";
import { DataTypes, Model } from "sequelize";

class User extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 255],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "User",
  }
);

export default User;
