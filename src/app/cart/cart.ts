import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { DbService, CartItem } from '../services/db.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  subtotal = 0;
  tax = 0;
  total = 0;
  cartCount = 0;
  loading = true;
  errorMessage = '';

  constructor(
    private dbService: DbService,
    private productService: ProductService,
    private changeDetector: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.items = await this.productService.loadProducts();
      this.recalculateTotals();
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Products could not be loaded.';
    } finally {
      this.loading = false;
      this.changeDetector.detectChanges();
    }
  }

  get cartItems(): CartItem[] {
    return this.items.filter(item => item.quantity > 0);
  }

  async increase(item: CartItem): Promise<void> {
    item.quantity++;
    this.recalculateTotals();
    await this.dbService.saveProducts(this.items);
  }

  async decrease(item: CartItem): Promise<void> {
    if (item.quantity > 0) {
      item.quantity--;
      this.recalculateTotals();
      await this.dbService.saveProducts(this.items);
    }
  }

  async clearCart(): Promise<void> {
    this.items.forEach(item => (item.quantity = 0));
    this.recalculateTotals();
    await this.dbService.saveProducts(this.items);
  }

  recalculateTotals(): void {
    this.subtotal = 0;
    this.cartCount = 0;

    this.items.forEach(item => {
      this.subtotal += item.price * item.quantity;
      this.cartCount += item.quantity;
    });

    this.tax = Math.round(this.subtotal * 0.05);
    this.total = this.subtotal + this.tax;
  }
}