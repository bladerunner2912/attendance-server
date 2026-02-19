import pool from "../../../config/db.js";

class Database {

    async query(sql, values = []) {
        if (!values || values.length < 1) {
            sql = pool.format(sql);
        }
        sql = pool.format(sql, values)
        const [rows] = await pool.execute(sql, values);
        return rows;
    }

    async create(table, { data }) {
        const columns = Object.keys(data);
        const placeholders = columns.map(() => "?");
        const values = Object.values(data);

        const sql = `
            INSERT INTO ??
            (${columns.map(() => "??").join(", ")})
            VALUES (${placeholders.join(", ")})
        `;

        return await this.query(sql, [table, ...columns, ...values]);
    }

    async read(table, { id, fields } = {}) {
        let sql = `SELECT ${fields ? fields.join(", ") : "*"} FROM ??`;
        let values = [table];

        if (id) {
            sql += ` WHERE id = ?`;
            values.push(id);
        }

        return await this.query(sql, values);
    }

    async update(table, { id, data }) {
        const columns = Object.keys(data);
        const values = Object.values(data);

        const setClause = columns.map(col => `${col} = ?`).join(", ");

        const sql = `
            UPDATE ??
            SET ${setClause}
            WHERE id = ?
        `;

        return await this.query(sql, [table, ...values, id]);
    }

    async delete(table, { id }) {
        const sql = `DELETE FROM ?? WHERE id = ?`;
        return await this.query(sql, [table, id]);
    }
}

export default new Database();

