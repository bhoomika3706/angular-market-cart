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
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch products' });
    }

    const products = rows.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      color: product.color,
      sizes: product.sizes.split(','),
      stock: product.stock,
      rating: {
        rate: product.rating,
        count: product.ratingCount
      }
    }));

    res.json(products);
  });
});

app.listen(PORT, () => {
  console.log(`MarketCart backend running at http://localhost:${PORT}`);
});