import config from "./config.js";

const dbConfig = {
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    connectionLimit: config.DB_CONNECTION_LIMIT
};

if (config.DB_USER) {
    dbConfig.user = config.DB_USER;
}

if (config.DB_PASSWORD) {
    dbConfig.password = config.DB_PASSWORD;
}

if (config.DB_SOCKET_PATH) {
    dbConfig.socketPath = config.DB_SOCKET_PATH;
}

export default dbConfig;
