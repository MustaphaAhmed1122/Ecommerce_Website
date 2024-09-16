import bcrypt from "bcryptjs";

export const hash = ({ plaintext, salt = process.env.SlatRound } = {}) => {
  const hashvalue = bcrypt.hashSync(plaintext, parseInt(salt));
  return hashvalue;
};

export const compare = ({ plaintext, hashvalue } = {}) => {
  const match = bcrypt.compareSync(plaintext, hashvalue);
  return match;
};
