import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT || 13088,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: true,
    ca: Buffer.from(process.env.DB_CA_CERT, "base64").toString("utf-8")
  },
});

export default pool;
