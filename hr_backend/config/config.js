import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the certificate (Windows-compatible)
const caCertPath = path.join(process.cwd(), "certs", "ca.pem");

if (!fs.existsSync(caCertPath)) {
  console.error("❌ CA certificate not found at:", caCertPath);
  process.exit(1);
}

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
    ca: fs.readFileSync(caCertPath), // Load the CA certificate
  },
});

export default pool;
