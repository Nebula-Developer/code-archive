import { verify, sign } from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET ||
  new Date().getTime().toString()) as string;

/**
 * Creates a JWT from the given data, encoded with the JWT_SECRET
 * @param data The data to encode
 * @returns The JWT
 */
export const createToken = (data: any) => {
  return sign(data, JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Verifies a JWT with the JWT_SECRET
 * @param token The JWT to verify
 * @returns The decoded data
 */
export const verifyToken = (token: string) => {
  return verify(token, JWT_SECRET);
};

export default {
  createToken,
  verifyToken,
};
