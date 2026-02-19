'use strict';

import { createPool } from 'mysql2/promise';
import logger from '../logger/index.js';
let logged = false;
class Database {
    constructor(config) {
        if (!config?.host) {
            throw new Error('Database config is required');
        }
        this.pool = createPool({
            host: config.host,
            port: Number(config.port),
            user: config.user,
            password: config.password,
            database: config.database,
            connectTimeout: 30000,
            connectionLimit: config.connectionLimit || 10,
            queueLimit: 0,
            timezone: 'Z',
            multipleStatements: true
        });

        this.pool.on('connection', (conn) => {
            if (!logged) {
                logged = true;
                logger.info({
                    threadId: conn.threadId,
                    host: config.host,
                    database: config.database
                }, 'MySQL pool connected');
            }
        });

        this.pool.on('error', (err) => {
            logger.error({ err }, 'MySQL pool error');
        });
    }



    format(sql, params = []) {
        return this.pool.format(sql, params);
    }

    async query(sql, params = []) {
        const start = Date.now();

        try {
            if (params.length > 0) {
                sql = this.pool.format(sql, params);
                // logger.info(sql);
            }
            const [rows] = await this.pool.query(sql);

            logger.debug({
                sql,
                durationMs: Date.now() - start
            }, 'DB query executed');

            return rows;
        } catch (err) {
            logger.error({
                sql,
                error: err.message,
                durationMs: Date.now() - start
            }, 'DB query failed');

            throw err;
        }
    }



    async getConnection() {
        return this.pool.getConnection();
    }

    async healthCheck() {
        await this.query('SELECT 1');
        return true;
    }

    async init() {
        try {
            await this.healthCheck();
            logger.info('Database connection verified');
        } catch (err) {
            logger.fatal({
                host: this.pool.config.connectionConfig.host,
                port: this.pool.config.connectionConfig.port,
                error: err.message
            }, 'Database is unreachable');

            process.exit(1);
        }
    }

    /**
 * Generic fetch method for
 * @param {Object} options
 * @param {string} options.table - table name
 * @param {Object} options.where - where conditions
 * @param {Array} options.fields - fields to select
 * @param {number} options.limit - limit records
 * @param {string} options.orderBy - column to order by
 * @param {string} options.order - order direction (ASC or DESC)
 */
    async select({ table, where = null, fields = ['*'], limit = 1, orderBy = null, order = 'ASC' }) {
        try {
            if (!table) {
                throw new Error('Table name is required');
            }

            const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 1;

            let whereClause = '';
            let values = [];

            if (where && Object.keys(where).length > 0) {
                const keys = Object.keys(where);
                whereClause = 'WHERE ' + keys.map(key => `${key} = ?`).join(' AND ');
                values = Object.values(where);
            }

            const sql = `
            SELECT ${fields.join(', ')}
            FROM ${table}
            ${whereClause}
            ${orderBy ? `ORDER BY ${orderBy} ${order === 'DESC' ? 'DESC' : 'ASC'}` : ''}
            LIMIT ${safeLimit}
        `;

            const rows = await this.query(sql, values);

            if (!rows || rows.length === 0) {
                return null;
            }

            if (rows.length === 1) {
                return rows[0];
            }

            return rows;

        } catch (error) {
            throw new Error(`select() failed: ${error.message}`);
        }
    }


    /**
     * Generic update method
     * @param {Object} options
     * @param {string} options.table - table name
     * @param {Object} options.data - columns to update
     * @param {Object} options.where - where conditions
     * @param {number} options.limit - limit rows
     */
    async update({ table, data, where, limit = 1, conn = null }) {
        try {
            if (!table || !data || !where) {
                throw new Error('Table, data and where clause are required');
            }

            const dataKeys = Object.keys(data);
            const whereKeys = Object.keys(where);

            const setClause = dataKeys.map(key => `${key} = ?`).join(', ');
            const whereClause = whereKeys.map(key => `${key} = ?`).join(' AND ');

            const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 1;

            const sql = `
            UPDATE ${table}
            SET ${setClause}
            WHERE ${whereClause}
            LIMIT ${safeLimit}
        `;

            const values = [
                ...Object.values(data),
                ...Object.values(where)
            ];
            console.log(this.pool.format(sql, values));
            const result = await this.query(sql, values);

            return {
                status: true,
                affectedRows: result.affectedRows
            };

        } catch (error) {
            throw new Error(`update() failed: ${error.message}`);
        }
    }


    /**
 * Generic insert method
 * @param {Object} options
 * @param {string} options.table - table name
 * @param {Object} options.data - key/value pairs to insert
 */
    async insert({ table, data }) {
        try {
            if (!table || !data || Object.keys(data).length === 0) {
                throw new Error('Table and data are required for insert');
            }

            const columns = Object.keys(data);
            const placeholders = columns.map(() => '?').join(', ');
            const values = Object.values(data);

            const sql = `
            INSERT INTO ${table} (${columns.join(', ')})
            VALUES (${placeholders})
        `;

            const result = await this.query(sql, values);

            return {
                status: true,
                insertId: result.insertId
            };

        } catch (error) {
            throw new Error(`insert() failed: ${error.message}`);
        }
    }


    /**
     * Generic delete method
     * @param {Object} options
     * @param {string} options.table - table name
     * @param {Object} options.where - where conditions
     * @param {number} options.limit - limit rows
     */
    async remove({ table, where, limit = 1 }) {
        try {
            if (!table || !where || Object.keys(where).length === 0) {
                throw new Error('Table and where clause are required for delete');
            }

            const whereKeys = Object.keys(where);
            const whereClause = whereKeys.map(key => `${key} = ?`).join(' AND ');
            const values = Object.values(where);

            const sql = `
            DELETE FROM ${table} 
            WHERE ${whereClause} 
            LIMIT ${Number(limit)}
        `;

            console.log(sql);

            // FIX: Remove 'limit' from the values array passed to the query
            const result = await this.query(sql, values);


            return {
                status: true,
                affectedRows: result.affectedRows
            };

        } catch (error) {
            throw new Error(`delete() failed: ${error.message}`);
        }
    }

    async withTransaction(callback) {
        const conn = await this.getConnection();
        try {
            await conn.beginTransaction();
            const result = await callback(conn);
            await conn.commit();
            return result;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }


    async close() {
        await this.pool.end();
        logger.info('MySQL pool closed');
    }
}

export default Database;
