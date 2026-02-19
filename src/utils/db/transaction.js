'use strict';

const logger = require('../utils/logger');

class Transaction {
    constructor(connection) {
        this.connection = connection;
    }

    async begin() {
        await this.connection.beginTransaction();
    }

    async query(sql, params = []) {
        return this.connection.execute(sql, params).then(([rows]) => rows);
    }

    async commit() {
        await this.connection.commit();
        this.connection.release();
    }

    async rollback() {
        await this.connection.rollback();
        this.connection.release();
        logger.warn('Transaction rolled back');
    }
}

module.exports = Transaction;
