import config from "../../config/config.js";


import pkg from 'jsonwebtoken';
const { sign } = pkg;

const ACCESS_SECRET = config.SECRET_KEY;

export default function generateAccessToken(payload) {
    return sign(payload, ACCESS_SECRET, { expiresIn: '15min' });
}

