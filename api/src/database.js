import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

// Ladataan oikea .env NODE_ENV perusteella
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config(); // .env
}

// Host joko dockerin tai local perusteella
const host = process.env.TEST_DB_HOST || "localhost";

const connectionString =
  process.env.NODE_ENV === "test"
    ? `postgres://${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASSWORD}@${host}:${process.env.TEST_DB_PORT}/${process.env.TEST_DB_NAME}`
    : process.env.DATABASE_URL;


const pool = new Pool({
  connectionString,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

export default pool;
