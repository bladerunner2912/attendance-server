import mysql from "mysql2/promise";
import dbConfig from "../../config/db.js";

async function columnExists(connection, columnName) {
    const [rows] = await connection.query(
        `
        SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
          AND TABLE_NAME = 'sessions'
          AND COLUMN_NAME = ?
        LIMIT 1
        `,
        [dbConfig.database, columnName]
    );
    return rows.length > 0;
}

async function sessionTableExists(connection) {
    const [rows] = await connection.query(
        `
        SELECT 1
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = ?
          AND TABLE_NAME = 'sessions'
        LIMIT 1
        `,
        [dbConfig.database]
    );
    return rows.length > 0;
}

async function sessionClassFkExists(connection) {
    const [rows] = await connection.query(
        `
        SELECT 1
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
        WHERE kcu.TABLE_SCHEMA = ?
          AND kcu.TABLE_NAME = 'sessions'
          AND kcu.COLUMN_NAME = 'class_id'
          AND kcu.REFERENCED_TABLE_NAME = 'classes'
          AND kcu.REFERENCED_COLUMN_NAME = 'id'
        LIMIT 1
        `,
        [dbConfig.database]
    );
    return rows.length > 0;
}

async function ensureSessionsSchema(connection) {
    const exists = await sessionTableExists(connection);

    if (!exists) {
        await connection.query(`
            CREATE TABLE sessions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                class_id INT NOT NULL,
                name VARCHAR(150) NOT NULL,
                description TEXT,
                session_date DATE NOT NULL,
                duration INT NOT NULL,
                start_time TIME,
                end_time TIME,
                CONSTRAINT fk_sessions_class_id
                    FOREIGN KEY (class_id)
                    REFERENCES classes(id)
                    ON DELETE CASCADE
            )
        `);
        console.log("Created sessions table with latest schema.");
        return;
    }

    const migrationSteps = [
        ["class_id", "ALTER TABLE sessions ADD COLUMN class_id INT NOT NULL"],
        ["name", "ALTER TABLE sessions ADD COLUMN name VARCHAR(150) NOT NULL"],
        ["description", "ALTER TABLE sessions ADD COLUMN description TEXT"],
        ["session_date", "ALTER TABLE sessions ADD COLUMN session_date DATE NOT NULL"],
        ["duration", "ALTER TABLE sessions ADD COLUMN duration INT NOT NULL"],
        ["start_time", "ALTER TABLE sessions ADD COLUMN start_time TIME NULL"],
        ["end_time", "ALTER TABLE sessions ADD COLUMN end_time TIME NULL"]
    ];

    for (const [columnName, sql] of migrationSteps) {
        const existsColumn = await columnExists(connection, columnName);
        if (!existsColumn) {
            await connection.query(sql);
            console.log(`Added sessions.${columnName}`);
        }
    }

    const hasFk = await sessionClassFkExists(connection);
    if (!hasFk) {
        await connection.query(`
            ALTER TABLE sessions
            ADD CONSTRAINT fk_sessions_class_id
            FOREIGN KEY (class_id)
            REFERENCES classes(id)
            ON DELETE CASCADE
        `);
        console.log("Added sessions.class_id foreign key.");
    }
}

async function main() {
    const connection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: Number(dbConfig.port),
        database: dbConfig.database,
        multipleStatements: true
    });

    try {
        await ensureSessionsSchema(connection);
        console.log("Session schema check completed.");
    } finally {
        await connection.end();
    }
}

main().catch((error) => {
    console.error("Session schema migration failed:", error.message);
    process.exit(1);
});
