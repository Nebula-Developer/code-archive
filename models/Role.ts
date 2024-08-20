import sequelize from "../database";
import { DataTypes, Model } from "sequelize";

/**
 * The base Role model assigned to users.
 */
class Role extends Model {
  declare id: number;
  declare name: string;
  declare color: string;
}

Role.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 255],
      },
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 255],
      },
    },
  },
  {
    sequelize,
    modelName: "Role",
  }
);

export default Role;
