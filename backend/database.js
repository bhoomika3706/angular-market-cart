const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'marketcart.db');

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error('Database connection failed:', error.message);
  } else {
    console.log('Connected to MarketCart database');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      price INTEGER NOT NULL,
      category TEXT,
      image TEXT,
      description TEXT,
      rating REAL,
      color TEXT,
      sizes TEXT,
      stock INTEGER
    )
  `);
});

module.exports = db;