import { hash as _hash, compare } from 'bcrypt';
import config from '../../config/config.js';

const SALT_ROUNDS = config.BCRYPT_ROUNDS;

function withPepper(password) {
    return `${password}:${config.SECRET_KEY}`;
}

async function hashPassword(plainPassword) {
    try {
        return await _hash(withPepper(plainPassword), SALT_ROUNDS);
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

async function comparePassword(plainPassword, hashedPassword) {
    try {
        return await compare(withPepper(plainPassword), hashedPassword);
    } catch (error) {
        throw new Error('Error comparing password');
    }
}

export default {
    hashPassword,
    comparePassword
};
