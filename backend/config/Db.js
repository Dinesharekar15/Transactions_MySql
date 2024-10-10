require('dotenv').config();
const mysql = require('mysql2/promise');

let db; // Connection variable

const connectDb = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("MySQL connected");
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
    process.exit(1);
  }
};

// Make sure to call this in your main app file
const getDb = () => {
  if (!db) {
    throw new Error("Database connection not established. Call connectDb() first.");
  }
  return db;
};
module.exports = {connectDb,getDb};
