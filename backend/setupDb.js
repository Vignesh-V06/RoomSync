const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  try {
    // Connect without database first to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL...');
    
    // Read schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolons and execute each statement
    const statements = schemaSql.split(';').filter(stmt => stmt.trim() !== '');

    for (let stmt of statements) {
      if (stmt.trim()) {
        await connection.query(stmt);
      }
    }

    console.log('Database and tables initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to setup database:', error);
    process.exit(1);
  }
}

setupDatabase();
