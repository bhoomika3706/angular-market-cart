const db = require('./database');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      price INTEGER NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      color TEXT NOT NULL,
      sizes TEXT NOT NULL,
      stock INTEGER NOT NULL,
      rating REAL NOT NULL,
      ratingCount INTEGER NOT NULL
    )
  `);

  db.run(`DELETE FROM products`);

  const products = [
    [
      1,
      "Fjallraven Backpack",
      999,
      "men's clothing",
      "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      "A durable everyday backpack with spacious storage, comfortable straps, and a clean design for college, office and travel use.",
      "Blue",
      "Standard",
      1000,
      4.2,
      245
    ],
    [
      2,
      "Men's Casual Cotton T-Shirt",
      499,
      "men's clothing",
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY_.jpg",
      "A soft cotton casual T-shirt designed for daily comfort, college wear, outings and relaxed styling with a clean modern fit.",
      "Blue",
      "S,M,L,XL",
      1000,
      4.1,
      180
    ],
    [
      3,
      "Men's Cotton Jacket",
      1499,
      "men's clothing",
      "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
      "A stylish cotton jacket made for casual layering, offering a neat look, comfortable fit and easy styling for mild weather.",
      "Brown",
      "S,M,L,XL",
      1000,
      4.7,
      300
    ],
    [
      4,
      "Men's Casual Slim Fit",
      799,
      "men's clothing",
      "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
      "A comfortable slim fit shirt suitable for casual meetings, office wear and evening outings with a polished everyday look.",
      "Black",
      "S,M,L,XL",
      1000,
      4.3,
      210
    ],
    [
      5,
      "Elegant Gold Bracelet",
      1499,
      "jewelery",
      "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
      "An elegant gold bracelet designed to add a polished and graceful touch to festive, party and everyday outfits.",
      "Gold",
      "Standard",
      1000,
      4.7,
      150
    ],
    [
      6,
      "Classic Silver Ring",
      799,
      "jewelery",
      "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
      "A classic silver ring with a simple elegant design, suitable for daily wear, gifting and special occasions.",
      "Silver",
      "Standard",
      1000,
      4.4,
      98
    ],
    [
      7,
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
    ],
    [
      8,
      "Full HD Computer Monitor",
      8999,
      "electronics",
      "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
      "A Full HD monitor designed for study, office work, coding, entertainment and comfortable daily screen usage.",
      "Black",
      "Standard",
      1000,
      4.8,
      520
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