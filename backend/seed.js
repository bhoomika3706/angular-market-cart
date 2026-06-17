const db = require('./database');

async function seedProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const apiProducts = await response.json();

    db.serialize(() => {
      db.run('DELETE FROM products');

      const query = `
        INSERT INTO products
        (title, price, category, image, description, rating, color, sizes, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      apiProducts.forEach(product => {
        db.run(query, [
          product.title,
          Math.round(product.price),
          product.category,
          product.image,
          product.description,
          product.rating?.rate || 0,
          'Default',
          'S,M,L',
          20
        ]);
      });

      console.log(`${apiProducts.length} products inserted successfully`);
    });
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    setTimeout(() => {
      db.close();
    }, 1000);
  }
}

seedProducts();