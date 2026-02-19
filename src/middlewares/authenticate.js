import { verify } from 'jsonwebtoken';
import config from "../../config/config.js";

const ACCESS_SECRET = config.SECRET_KEY;

function authenticate(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(' ')[1];

    try {
        const decoded = verify(token, ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

function authorize(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}

export default {
    authenticate,
    authorize
};

