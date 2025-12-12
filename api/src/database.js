import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

// Ladataan oikea .env NODE_ENV perusteella
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config(); // .env
}

const connectionString = process.env.NODE_ENV === "test"
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;


const pool = new Pool({
  connectionString,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

export default pool;
