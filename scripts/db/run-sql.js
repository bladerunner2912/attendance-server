import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import dbConfig from '../../config/db.js';

async function main() {
    const sqlFile = process.argv[2];

    if (!sqlFile) {
        console.error('Usage: node scripts/db/run-sql.js <sql_file_path>');
        process.exit(1);
    }

    const absoluteSqlPath = path.resolve(process.cwd(), sqlFile);
    let sql = await fs.readFile(absoluteSqlPath, 'utf8');
    sql = sql.replace(/__DB_NAME__/g, dbConfig.database);

    const connectionOptions = {
        multipleStatements: true
    };

    if (dbConfig.socketPath) {
        connectionOptions.socketPath = dbConfig.socketPath;
    } else {
        connectionOptions.host = dbConfig.host;
        connectionOptions.port = Number(dbConfig.port);
    }

    if (dbConfig.user) {
        connectionOptions.user = dbConfig.user;
    }

    if (dbConfig.password) {
        connectionOptions.password = dbConfig.password;
    }

    const connection = await mysql.createConnection(connectionOptions);

    try {
        await connection.query(sql);
        console.log(`Executed ${sqlFile} successfully.`);
    } finally {
        await connection.end();
    }
}

main().catch((error) => {
    console.error('SQL execution failed:', error.message);
    process.exit(1);
});
