const db = require('./database');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      title TEXT,
      price INTEGER,
      category TEXT,
      image TEXT,
      description TEXT,
      color TEXT,
      sizes TEXT,
      stock INTEGER,
      rating REAL,
      ratingCount INTEGER
    )
  `);

  db.run(`DELETE FROM products`);

  const products = [
    [
      1,
      "Men's Casual Cotton T-Shirt",
      499,
      "men's clothing",
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
      "A soft cotton casual T-shirt designed for daily comfort, college wear, outings and relaxed styling with a clean modern fit.",
      "Blue",
      "S,M,L,XL",
      1000,
      4.2,
      245
    ],
    [
      2,
      "Men's Premium Slim Fit Shirt",
      899,
      "men's clothing",
      "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
      "A premium slim fit shirt suitable for casual meetings, office wear and evening outings with a polished everyday look.",
      "Black",
      "S,M,L,XL",
      1000,
      4.1,
      180
    ],
    [
      3,
      "Women's Lightweight Jacket",
      1299,
      "women's clothing",
      "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
      "A lightweight women’s jacket made for casual layering, comfortable travel, daily outings and a stylish minimal look.",
      "White",
      "S,M,L,XL",
      1000,
      4.5,
      320
    ],
    [
      4,
      "Portable 1TB External Hard Drive",
      4299,
      "electronics",
      "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
      "A reliable 1TB external hard drive for storing documents, photos, videos, projects and important backup files securely.",
      "Black",
      "Standard",
      1000,
      4.6,
      430
    ]
  ];

  const insertQuery = `
    INSERT INTO products 
    (id, title, price, category, image, description, color, sizes, stock, rating, ratingCount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  products.forEach(product => {
    db.run(insertQuery, product);
  });

  console.log('Products seeded successfully');
});

db.close();