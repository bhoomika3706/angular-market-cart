# Angular Market Cart

Angular Market Cart is a simple shopping cart app built with Angular. It fetches product data from an API, stores it in IndexedDB, and keeps the cart data available after refreshing the page.

## Features

- Fetches products from Fake Store API
- Stores product data in IndexedDB
- Loads saved products from cache on refresh
- Refreshes API data after 4 hours
- Add and remove item quantities
- Shows total cart price
- Shows total number of items in cart
- Clear cart button

## Technologies Used

- Angular
- TypeScript
- HTML
- CSS
- IndexedDB
- Fake Store API

## API Used

Products are fetched from:

```text
https://fakestoreapi.com/products
How It Works
When the app opens for the first time, it fetches product data from the API.
The product data is saved in IndexedDB.
When the page is refreshed, the app loads data from IndexedDB instead of calling the API again.
After 4 hours, the app fetches fresh data from the API and updates IndexedDB.
Cart quantity changes are also saved, so the cart state remains after refresh.
How To Run The Project
Clone the repository:

git clone https://github.com/bhoomika3706/angular-market-cart.git
Go inside the project folder:

cd angular-market-cart
Install dependencies:

npm install
Start the Angular development server:

npx ng serve
Open in browser:

http://localhost:4200
Project Structure
src/
  app/
    services/
      db.service.ts
    app.ts
    app.html
    app.css
  main.ts
Main Files
app.ts - Main component logic
app.html - Shopping cart UI
db.service.ts - IndexedDB storage logic
main.ts - Angular app bootstrap file
Author
Created by Bhoomika.
