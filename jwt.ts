import { verify, sign } from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET || new Date().getTime().toString()) as string;

export const createToken = (data: any) => {
  return sign(data, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return verify(token, JWT_SECRET);
};

export default {
  createToken,
  verifyToken,
};
