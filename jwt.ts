import { verify, sign } from "jsonwebtoken";

const secret = "mysecret";

export const createToken = (data: any) => {
  return sign(data, secret, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return verify(token, secret);
};
