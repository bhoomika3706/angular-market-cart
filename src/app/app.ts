import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgFor],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  items = [
    { name: 'Apple', price: 20, quantity: 0 },
    { name: 'Banana', price: 10, quantity: 0 },
    { name: 'Mango', price: 50, quantity: 0 },
    { name: 'Grapes', price: 40, quantity: 0 },
  ];

  total = 0;
  cartCount = 0;

  increase(item: any) {
    item.quantity++;
    this.total += item.price;
    this.cartCount++;
  }

  decrease(item: any) {
    if (item.quantity > 0) {
      item.quantity--;
      this.total -= item.price;
      this.cartCount--;
    }
  }

  clearCart() {
    this.items.forEach(item => item.quantity = 0);
    this.total = 0;
    this.cartCount = 0;
  }
}