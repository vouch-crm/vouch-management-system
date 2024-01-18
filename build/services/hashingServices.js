"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashingServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const saltRounds = process.env.SALT_ROUNDS;
const secretKey = process.env.SECRET_KEY;
const hashPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(parseInt(saltRounds));
    const hashed = await bcrypt_1.default.hash(password + secretKey, salt);
    return hashed;
};
const verifyHash = async (password, hashedPassword) => {
    const check = await bcrypt_1.default.compare(password, hashedPassword);
    return check;
};
exports.hashingServices = {
    hashPassword,
    verifyHash
};
