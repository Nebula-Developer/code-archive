import sequelize from "../../database";
import { DataTypes, Model } from "sequelize";
import User from "../User";

class Group extends Model {
  declare id: number;
  declare ownerId: number;
  declare name: string;
  declare password: string;

  declare getUsers: () => Promise<User[]>;
  declare addUser: (user: User) => Promise<void>;
  declare removeUser: (user: User) => Promise<void>;
  declare addAdmin: (user: User) => Promise<void>;
  declare removeAdmin: (user: User) => Promise<void>;
  declare setOwner: (user: User) => Promise<void>;
  declare hasUser: (user: User) => Promise<boolean>;
}

Group.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Group",
  }
);

Group.belongsToMany(User, { through: "GroupMembers" });
User.belongsToMany(Group, { through: "GroupMembers" });

Group.belongsToMany(User, { through: "GroupAdmins", as: "admins" });
User.belongsToMany(Group, { through: "GroupAdmins", as: "adminOf" });

Group.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
User.hasMany(Group, { foreignKey: "ownerId", as: "ownedGroups" });

Group.addScope("defaultScope", {
  attributes: { exclude: ["password"] },
});

export default Group;
