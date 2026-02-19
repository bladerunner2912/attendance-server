import generateAccessToken from '../utils/jwt.js';
import model from '../models/users.js';

import crypto from '../utils/crypto.js';
const {
    findUserByEmail,
    findStudentProfileByUserId,
    findInstructorProfileByUserId,
    createUser,
    saveAccessToken
} = model;
const { hashPassword, comparePassword } = crypto;

async function register(req, res) {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password and role required"
            });
        }

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await hashPassword(password);

        const userId = await createUser({
            email,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            message: "User created successfully",
            userId
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const payload = {
            userId: user.id,
            role: user.role
        };

        const accessToken = generateAccessToken(payload);

        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await saveAccessToken(user.id, accessToken, expiry);

        let profile = null;
        let studentId = null;
        let instructorId = null;

        if (user.role === 'STUDENT') {
            profile = await findStudentProfileByUserId(user.id);
            studentId = profile?.id ?? null;
        } else if (user.role === 'INSTRUCTOR') {
            profile = await findInstructorProfileByUserId(user.id);
            instructorId = profile?.id ?? null;
        }

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            role: user.role,
            user_id: user.id,
            student_id: studentId,
            instructor_id: instructorId,
            profile: profile ? {
                id: profile.id,
                user_id: profile.user_id,
                fullname: profile.fullname,
                phone_no: profile.phone_no
            } : null
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export default {
    register,
    login
};
