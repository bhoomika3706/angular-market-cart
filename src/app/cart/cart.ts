import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DbService, CartItem } from '../services/db.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;
  cartCount = 0;
  loading = true;
  errorMessage = '';

  private fourHours = 4 * 60 * 60 * 1000;

  constructor(
    private http: HttpClient,
    private dbService: DbService,
    private changeDetector: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.dbService.initDB();

      const savedProducts = await this.dbService.getProducts();
      const lastFetchTime = await this.dbService.getLastFetchTime();

      const now = Date.now();
      const hasProducts = savedProducts.length > 0;
      const cacheIsFresh = lastFetchTime !== null && now - lastFetchTime < this.fourHours;

      if (hasProducts && cacheIsFresh) {
        this.items = savedProducts;
      } else {
        const apiProducts = await firstValueFrom(
          this.http.get<any[]>('https://fakestoreapi.com/products')
        );

        this.items = apiProducts.map(product => ({
          id: product.id,
          name: product.title,
          price: Math.round(product.price),
          quantity: 0
        }));

        await this.dbService.saveProducts(this.items);
        await this.dbService.saveLastFetchTime(now);
      }

      this.recalculateTotals();
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Products could not be loaded.';
    } finally {
      this.loading = false;
      this.changeDetector.detectChanges();
    }
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
    this.items.forEach(item => item.quantity = 0);
    this.recalculateTotals();
    await this.dbService.saveProducts(this.items);
  }

  recalculateTotals(): void {
    this.total = 0;
    this.cartCount = 0;

    this.items.forEach(item => {
      this.total += item.price * item.quantity;
      this.cartCount += item.quantity;
    });
  }
}