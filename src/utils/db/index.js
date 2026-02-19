import Database from './database.js';
import pool from '../../../config/db.js';

const db = new Database(pool);

export default db;
