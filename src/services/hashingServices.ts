import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()
const saltRounds = process.env.SALT_ROUNDS as string;
const secretKey = process.env.SECRET_KEY as string;

const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(parseInt(saltRounds));
    const hashed = await bcrypt.hash(password + secretKey, salt);

    return hashed
}

const verifyHash = async (password: string, hashedPassword: string): Promise<boolean> => {
    const check = await bcrypt.compare(password, hashedPassword)

    return check
}

export const hashingServices = {
    hashPassword,
    verifyHash
}