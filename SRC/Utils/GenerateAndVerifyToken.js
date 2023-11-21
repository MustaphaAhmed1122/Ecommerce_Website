import jwt from "jsonwebtoken";

export const generateToken = ({
  payload,
  signature = process.env.SecertKey,
  expiresIn = 60 * 30,
} = {}) => {
  const token = jwt.sign(payload, signature, {
    expiresIn: parseInt(expiresIn),
  });
  return token;
};

export const verifyToken = ({
  token,
  signature = process.env.SecertKey,
} = {}) => {
  const decoded = jwt.verify(token, signature);
  return decoded;
};
