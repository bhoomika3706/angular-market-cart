const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Handy sanity check: open http://localhost:3000 in a browser tab.
// If this doesn't load, the backend isn't running — that's step 1 of debugging.
app.get('/', (req, res) => {
  res.send('MarketCart Backend is running ✅');
});

app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (error, rows) => {
    if (error) {
      console.error('GET /products failed:', error.message);
      res.status(500).json({ error: error.message });
      return;
    }

    const products = rows.map(product => ({
      ...product,
      sizes: product.sizes ? product.sizes.split(',') : []
    }));

    console.log(`Sent ${products.length} products`);
    res.json(products);
  });
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;

  db.get('SELECT * FROM products WHERE id = ?', [id], (error, product) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    product.sizes = product.sizes ? product.sizes.split(',') : [];
    res.json(product);
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});