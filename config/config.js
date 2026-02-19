import fs from "fs";
import path from "path";

function loadDotEnv() {
    const envPath = path.resolve(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) {
        return;
    }

    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
            continue;
        }

        const equalsIndex = trimmed.indexOf("=");
        if (equalsIndex < 1) {
            continue;
        }

        const key = trimmed.slice(0, equalsIndex).trim();
        const value = trimmed.slice(equalsIndex + 1).trim();
        if (!(key in process.env)) {
            process.env[key] = value;
        }
    }
}

loadDotEnv();

const toInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) ? parsed : fallback;
};

const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: toInt(process.env.PORT, 3000),

    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: toInt(process.env.DB_PORT, 3306),
    DB_NAME: process.env.DB_NAME || "attendance_db",
    DB_USER: process.env.DB_USER || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_SOCKET_PATH: process.env.DB_SOCKET_PATH || "",
    DB_CONNECTION_LIMIT: toInt(process.env.DB_CONNECTION_LIMIT, 10),

    SECRET_KEY: process.env.SECRET_KEY || "daisy",
    BCRYPT_ROUNDS: toInt(process.env.BCRYPT_ROUNDS, 10)
};

export default config;
