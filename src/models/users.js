import db from '../utils/db/index.js';

async function createUser({ email, password, role }) {
    const user = await db.insert({ table: 'users' }, {
        data: {
            email,
            password,
            role
        }
    });

    return user.insertId || user.id;
}


async function findUserByEmail(email) {
    return db.select({ table: "users", where: { email: email } });
}

async function findStudentProfileByUserId(userId) {
    return db.select({
        table: "students",
        where: { user_id: userId },
        fields: ["id", "user_id", "fullname", "phone_no"]
    });
}

async function findInstructorProfileByUserId(userId) {
    return db.select({
        table: "instructors",
        where: { user_id: userId },
        fields: ["id", "user_id", "fullname", "phone_no"]
    });
}


async function saveAccessToken(userId, token) {
    await db.update({
        table: 'users',
        data: {
            access_token: token,
        },
        where: { id: userId }
    });
}

export default {
    createUser,
    findUserByEmail,
    findStudentProfileByUserId,
    findInstructorProfileByUserId,
    saveAccessToken
}

