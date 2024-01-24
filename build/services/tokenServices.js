"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenServices = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (id, email) => {
    try {
        const payload = {
            'id': id,
            'email': email
        };
        const secretKey = process.env.SECRET_TOKEN_KEY;
        const token = jsonwebtoken_1.default.sign(payload, secretKey);
        return {
            status: 'Success',
            token: token,
            message: null,
            decoded: null
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `error generating the token: ${error}`,
            token: null,
            decoded: null
        };
    }
};
const verifyToken = (token) => {
    try {
        const secretKey = process.env.SECRET_TOKEN_KEY;
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return {
            status: 'Success',
            decoded: decoded,
            message: null,
            token: null
        };
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return {
                status: 'Error',
                message: 'token has expired',
                token: null,
                decoded: null
            };
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return {
                status: 'Error',
                message: 'invalid token',
                token: null,
                decoded: null
            };
        }
        else {
            return {
                status: 'Error',
                message: `error verifying the token: ${error}`,
                token: null,
                decoded: null
            };
        }
    }
};
exports.tokenServices = {
    generateToken,
    verifyToken
};
