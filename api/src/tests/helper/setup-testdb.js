import pool from '../../database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const setupTestDB = async () => {
    await dropAllTables();
    
    const dbPath = path.join(dirname, 'test-db.sql')
    const sql = fs.readFileSync(dbPath, 'utf8')
    await pool.query(sql)
}

const dropAllTables = async () => {
  await pool.query('DROP TABLE IF EXISTS group_members CASCADE')
  await pool.query('DROP TABLE IF EXISTS groups CASCADE')
  await pool.query('DROP TABLE IF EXISTS users CASCADE')
  await pool.query('DROP TABLE IF EXISTS review CASCADE')
  await pool.query('DROP TABLE IF EXISTS favorite CASCADE')
  await pool.query('DROP TYPE IF EXISTS member_role CASCADE')
  await pool.query('DROP TABLE IF EXISTS group_content CASCADE')
  await pool.query('DROP TABLE IF EXISTS group_chat CASCADE')
};
