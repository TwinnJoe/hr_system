import mysql from "mysql2/promise";

// Debug the certificate
console.log("=== SSL Debug Info ===");
console.log("DB_CA_CERT exists:", !!process.env.DB_CA_CERT);
if (process.env.DB_CA_CERT) {
  console.log("Certificate length:", process.env.DB_CA_CERT.length);
  try {
    const decoded = Buffer.from(process.env.DB_CA_CERT, "base64").toString("utf-8");
    console.log("Decoded cert starts with:", decoded.substring(0, 30));
    console.log("Decoded cert ends with:", decoded.substring(decoded.length - 30));
    console.log("Contains BEGIN:", decoded.includes("-----BEGIN"));
    console.log("Contains END:", decoded.includes("-----END"));
  } catch (e) {
    console.log("Error decoding:", e.message);
  }
}

// Try multiple SSL configurations
const configs = [
  {
    name: "No SSL",
    config: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 13088,
      ssl: false
    }
  },
  {
    name: "SSL with rejectUnauthorized false",
    config: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 13088,
      ssl: { rejectUnauthorized: false }
    }
  },
  {
    name: "URI with SSL required",
    config: {
      uri: `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?ssl-mode=REQUIRED`
    }
  }
];

let pool;
let workingConfig = null;

// Test each configuration
for (const { name, config } of configs) {
  try {
    console.log(`Testing: ${name}`);
    const testPool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 1,
      acquireTimeout: 5000,
      timeout: 10000
    });
    
    // Try a simple query
    const connection = await testPool.getConnection();
    await connection.ping();
    connection.release();
    
    console.log(`✅ ${name} - SUCCESS`);
    workingConfig = { name, config };
    pool = testPool;
    break;
    
  } catch (error) {
    console.log(`❌ ${name} - FAILED:`, error.code || error.message);
  }
}

if (!pool) {
  console.log("All SSL configurations failed. Using fallback...");
  // Fallback to basic config
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 13088,
    waitForConnections: true,
    connectionLimit: 10,
    ssl: { rejectUnauthorized: false }
  });
}

console.log("Using configuration:", workingConfig?.name || "fallback");
export default pool;
