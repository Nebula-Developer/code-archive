import database from "../../database";
import { DataTypes, Model } from "sequelize";
import User from "../User";
import Group from "./Group";

class Message extends Model {
    declare id: number;
    declare groupId: number;
    declare userId: number;
    declare content: string;
}

Message.init(
    {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        modelName: "Message",
    }
);

Message.belongsTo(Group, { foreignKey: "groupId", as: "group" });
Group.hasMany(Message, { foreignKey: "groupId", as: "messages" });

Message.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Message, { foreignKey: "userId", as: "messages" });

Message.addScope("defaultScope", {
  include: [
    {
      model: Group,
      as: "group",
      attributes: ["id", "name"],
    },
    {
      model: User,
      as: "user",
      attributes: ["id", "username", "email"],
    },
  ],
});

export default Message;
