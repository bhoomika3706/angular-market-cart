const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MarketCart Backend is running');
});

app.get('/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id ASC', [], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const products = rows.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      rating: product.rating,
      color: product.color,
      sizes: product.sizes ? product.sizes.split(',') : [],
      stock: product.stock
    }));

    res.json(products);
  });
});

app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);

  db.get('SELECT * FROM products WHERE id = ?', [id], (error, product) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      rating: product.rating,
      color: product.color,
      sizes: product.sizes ? product.sizes.split(',') : [],
      stock: product.stock
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});