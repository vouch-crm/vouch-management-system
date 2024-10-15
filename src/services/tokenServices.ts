import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();

export type tokenReturn = {
  status: string,
  message: string | null,
  token: string | null,
  decoded: Record<string, any> | null
}

const generateToken = (payload: Record<string, any>, expiresIn?: string): tokenReturn => {
  try {
    const secretKey = process.env.SECRET_TOKEN_KEY as string;

    const options: jwt.SignOptions = {};

    if(expiresIn) {
      options.expiresIn = expiresIn
    }
    
    const token = jwt.sign(payload, secretKey, options);
    return {
      status: 'Success',
      token: token,
      message: null,
      decoded: null
    }

  } catch (error) {
    return {
      status: 'Error',
      message: `error generating the token: ${error}`,
      token: null,
      decoded: null
    }
  }
}

const verifyToken = (token: string): tokenReturn => {
  try {
    const secretKey = process.env.SECRET_TOKEN_KEY as string;
    const decoded = jwt.verify(token, secretKey) as tokenReturn["decoded"];
    return {
      status: 'Success',
      decoded: decoded,
      message: null,
      token: null
    }

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        status: 'Expired',
        message: 'token has expired',
        token: null,
        decoded: null
      }

    } else if (error instanceof jwt.JsonWebTokenError) {
      return {
        status: 'Error',
        message: 'invalid token',
        token: null,
        decoded: null
      };

    } else {
      return {
        status: 'Error',
        message: `error verifying the token: ${error}`,
        token: null,
        decoded: null
      };
    }
  }
}

export const tokenServices = {
  generateToken,
  verifyToken
}