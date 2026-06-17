const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());

app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (error, rows) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    const products = rows.map(product => ({
      ...product,
      sizes: product.sizes ? product.sizes.split(',') : []
    }));

    res.json(products);
  });
});

app.get('/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (error, product) => {
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