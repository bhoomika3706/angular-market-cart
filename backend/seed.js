const db = require('./database');

const rupeePrices = [
  999, 499, 1499, 799, 2999,
  1299, 699, 899, 2499, 1599,
  399, 599, 1199, 1899, 999,
  3499, 2199, 749, 1399, 1799
];

const colors = [
  'Black', 'Blue', 'Brown', 'White', 'Gold',
  'Silver', 'Green', 'Red', 'Yellow', 'Pink',
  'Grey', 'Navy', 'Purple', 'Orange', 'Beige',
  'Maroon', 'Cream', 'Teal', 'Olive', 'Rose'
];

async function seedProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const apiProducts = await response.json();

    db.serialize(() => {
      db.run('DELETE FROM products', (deleteError) => {
        if (deleteError) {
          console.error('Delete failed:', deleteError.message);
          db.close();
          return;
        }

        const query = `
          INSERT INTO products
          (id, title, price, category, image, description, rating, color, sizes, stock)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const statement = db.prepare(query);

        apiProducts.forEach((product, index) => {
          statement.run([
            product.id,
            product.title,
            rupeePrices[index],
            product.category,
            product.image,
            product.description,
            product.rating?.rate || 0,
            colors[index],
            'S,M,L,XL',
            20 + index
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