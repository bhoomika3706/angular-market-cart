const db = require('./database');

async function seedProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const apiProducts = await response.json();

    db.serialize(() => {
      db.run('DELETE FROM products', (deleteError) => {
        if (deleteError) {
          console.error('Delete failed:', deleteError.message);
          return;
        }

        const query = `
          INSERT INTO products
          (id, title, price, category, image, description, rating, color, sizes, stock)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const statement = db.prepare(query);

        apiProducts.forEach(product => {
          statement.run([
            product.id,
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

        statement.finalize((finalizeError) => {
          if (finalizeError) {
            console.error('Insert failed:', finalizeError.message);
          } else {
            console.log(`${apiProducts.length} products inserted successfully`);
          }

          db.close();
        });
      });
    });
  } catch (error) {
    console.error('Seeding failed:', error);
    db.close();
  }
}

seedProducts();