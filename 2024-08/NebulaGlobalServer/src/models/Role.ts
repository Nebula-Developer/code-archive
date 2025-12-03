import database from "../database";
import { DataTypes, Model } from "sequelize";

/**
 * The base Role model assigned to users.
 */
class Role extends Model {
  declare id: number;
  declare name: string;
  declare stringId: string;
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
    stringId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 255],
        isLowercase: true,
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
    sequelize: database,
    modelName: "Role",
  },
);

Role.addScope("defaultScope", {
  attributes: ["id", "name", "stringId", "color"],
});

export default Role;
