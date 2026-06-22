# Angular Market Cart

Angular Market Cart is a full-stack shopping cart application built with Angular, Express.js, SQLite, and IndexedDB. The app fetches product data from a custom backend API, stores it in IndexedDB for faster access, and keeps cart data available even after refreshing the page.

## Features

- Fetches products from a custom Express.js backend API
- Stores product data in SQLite database
- Seeds initial product data using a backend seed script
- Stores product and cart data in IndexedDB
- Loads saved products from IndexedDB cache
- Reduces unnecessary backend API calls using caching
- Add products to cart
- Increase and decrease item quantity
- Shows total number of cart items
- Shows cart summary with subtotal, tax, and total
- Clear cart button
- Product search
- Category filter
- Color filter
- Price range filter
- Sort products by:
  - Price Low to High
  - Price High to Low
  - Rating High to Low
  - Name A to Z
- Product info popup with description, stock, color, and available sizes
- Favorites / Wishlist feature
- Favorites page to view liked products
- Dark mode and light mode
- Dark mode preference saved after refresh
- Loading skeletons
- Empty state message when no products are found
- Minimal and responsive UI

## Technologies Used

### Frontend

- Angular
- TypeScript
- HTML
- CSS
- IndexedDB

### Backend

- Node.js
- Express.js
- SQLite
- CORS
- Nodemon

## API Used

The app now uses a custom backend API instead of directly calling Fake Store API from the frontend.

Products are fetched from:

```text
http://localhost:3000/products
