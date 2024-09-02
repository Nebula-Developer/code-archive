import { verify, sign } from "jsonwebtoken";
import env from "./env";

const JWT_SECRET = env("JWT_SECRET", "secret");

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
