import database from "../database";
import { DataTypes, Model } from "sequelize";
import User from "./User";

class Place extends Model {
  declare id: number;
  declare ownerId: number;
  declare x: number;
  declare y: number;
  declare color: string;
  declare getOwner: () => Promise<User>;
}

Place.init(
  {
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "Place",
  }
);

Place.belongsTo(User, { foreignKey: "ownerId" });
User.hasMany(Place, { foreignKey: "ownerId" });

export async function placePixel(
  x: number,
  y: number,
  color: string,
  ownerId: number
) {
  const place = await Place.findOne({ where: { x, y } });
  if (place) {
    await place.update({ color, ownerId });
  } else {
    await Place.create({ x, y, color, ownerId });
  }
}

export async function getPlace(x: number, y: number) {
  return await Place.findOne({
    where: { x, y },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["username", "email", "id"],
      },
    ],
  });
}

export default Place;
