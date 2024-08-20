import bcrypt from "bcrypt";

const saltRounds = 10;

export const hash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const compare = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export default { hash, compare };
