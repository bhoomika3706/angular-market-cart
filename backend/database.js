const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./marketcart.db', (error) => {
  if (error) {
    console.error('Database connection failed:', error.message);
  } else {
    console.log('Connected to MarketCart database');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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