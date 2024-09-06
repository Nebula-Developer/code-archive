import database from "../database";
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
  declare color: string;

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
  declare addRole: (role: Role) => Promise<void>;

  /**
   * Removes a role from this user.
   */
  declare removeRole: (role: Role) => Promise<void>;
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
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [3, 30],
      },
      defaultValue: "#b4bbbf",
    },
  },
  {
    sequelize: database,
    modelName: "User",
  },
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
  attributes: { exclude: ["password"] },
});

export type SafeUser = {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  color: string;
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
    roles: user.roles,
    color: user.color,
  };
}

/**
 * Checks whether a user has a role with the given string ID.
 * @param user The user to check.
 * @param stringId The string ID of the role to check for.
 * @returns Whether the user has the role.
 */
export function hasRole(user: User, stringId: string): boolean {
  return user.roles.some((role) => role.stringId === stringId);
}

/**
 * Checks whether a user has a role with the given string ID.
 * @param userId The id of the user to check.
 * @param stringId The string ID of the role to check for.
 * @returns Whether the user has the role.
 */
export async function idHasRole(
  userId: number,
  stringId: string,
): Promise<boolean> {
  const user = await User.findByPk(userId);
  if (!user) return false;
  return user.roles.some((role) => role.stringId === stringId);
}

export default User;
