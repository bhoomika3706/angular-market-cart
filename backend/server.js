const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (error, rows) => {
    if (error) return res.status(500).json({ error: error.message });

    const products = rows.map(product => ({
      ...product,
      sizes: product.sizes ? product.sizes.split(',') : []
    }));

    res.json(products);
  });
});

app.get('/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (error, product) => {
    if (error) return res.status(500).json({ error: error.message });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.sizes = product.sizes ? product.sizes.split(',') : [];
    res.json(product);
  });
});

const frontendPath = path.join(__dirname, '../dist/market-cart/browser');
app.use(express.static(frontendPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});