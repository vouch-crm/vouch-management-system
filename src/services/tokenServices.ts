import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();

const generateToken = async (id: string, email: string) => {
    try {
        const payload = {
            'id': id,
            'email': email
        };
        const secretKey = process.env.SECRET_TOKEN_KEY as string;
        
        const token = await jwt.sign(payload, secretKey);
        return {
            status: 'Success',
            token: token
        }

    } catch (error) {
        return {
            status: 'Error',
            message: `error generating the token: ${error}`
        }
    }
}

const verifyToken = async (token: string) => {
    try {
        const secretKey = process.env.SECRET_TOKEN_KEY as string;
        const decoded = await jwt.verify(token, secretKey);
        return decoded;

      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          return {
            status: 'Error',
            message: 'token has expired'
          }
          
        } else if (error instanceof jwt.JsonWebTokenError) {
          return {
            status: 'Error',
            message: 'invalid token'
          };

        } else {
          return {
            status: 'Error',
            message: `error verifying the token: ${error}`
          };
        }
    }
}

export const tokenServices = {
    generateToken,
    verifyToken
}