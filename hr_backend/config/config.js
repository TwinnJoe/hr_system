import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 13088,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    // Try this approach for Aiven
    rejectUnauthorized: true,
    ca: process.env.DB_CA_CERT ? Buffer.from(process.env.DB_CA_CERT, "base64").toString("utf-8") : undefined
  },
});

export default pool;



