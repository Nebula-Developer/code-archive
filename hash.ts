import bcrypt from "bcryptjs";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10");

/**
 * Method to hash a password
 * @param password The password to hash
 * @returns The hashed password
 */
export const hash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Method to compare a password with a hash
 * @param password The password to compare
 * @param hash The hash to compare
 * @returns A boolean indicating if the password matches the hash
 */
export const compare = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export default { hash, compare };
