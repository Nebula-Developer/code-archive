import sequelize from "../database";
import { DataTypes, Model } from "sequelize";
import Role from "./Role";

/**
 * The base User model used across all platforms.
 */
class User extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;

  /**
   * The roles assigned to this user.
   */
  declare roles: Role[];

  /**
   * The roles assigned to this user.
   */
  declare getRoles: () => Promise<Role[]>;

  /**
   * Adds a role to this user.
   */
  declare addRole: (role: Role) => void;

  /**
   * Removes a role from this user.
   */
  declare removeRole: (role: Role) => void;
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
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

User.hasMany(Role, {
  foreignKey: "userId",
  as: "roles",
});

Role.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.addScope("defaultScope", {
  include: [{ model: Role, as: "roles" }],
});

export type SafeUser = {
  id: number;
  username: string;
  email: string;
};

/**
 * All User instances sent to the client are passed through this function,
 * which only includes any non-sensitive information.
 * @param user The User instance to be sanitized.
 * @returns A SafeUser instance. (This type may change)
 */
export function safeUser(user: User): SafeUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

export default User;
