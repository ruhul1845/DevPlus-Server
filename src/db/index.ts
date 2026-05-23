import { Pool } from "pg";
import config from "../config/index.js";

if (!config.connection_string) {
  console.warn("DATABASE_URL or CONNECTIONSTRING is missing in .env");
}

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(30) NOT NULL CHECK (type IN ('bug', 'feature_request')),
        status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
        reporter_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Database initialization failed", error);
    throw error;
  }
};

if (process.argv[1]?.endsWith("db/index.ts") || process.argv[1]?.endsWith("db/index.js")) {
  initDB()
    .then(() => pool.end())
    .catch(() => pool.end());
}
