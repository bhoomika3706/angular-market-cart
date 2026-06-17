const fs = require('fs');
const path = require('path');
const db = require('./database');

function seedProducts() {
  const filePath = path.join(__dirname, 'products.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const myProducts = JSON.parse(rawData);

  db.serialize(() => {
    db.run('DELETE FROM products');
    db.run("DELETE FROM sqlite_sequence WHERE name='products'"); // reset id counter

    const query = `
      INSERT INTO products
      (title, price, category, image, description, rating, color, sizes, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    myProducts.forEach(product => {
      db.run(query, [
        product.title,
        product.price,
        product.category,
        product.image,
        product.description,
        product.rating || 0,
        product.color || 'Default',
        product.sizes || 'S,M,L',
        product.stock ?? 20
      ]);
    });

    console.log(`${myProducts.length} products inserted from products.json`);
  });

  setTimeout(() => db.close(), 1000);
}

seedProducts();