import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DbService, CartItem } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  private fourHours = 4 * 60 * 60 * 1000;

  constructor(
    private http: HttpClient,
    private dbService: DbService
  ) {}

  async loadProducts(): Promise<CartItem[]> {
    await this.dbService.initDB();

    const savedProducts = await this.dbService.getProducts();
    const lastFetchTime = await this.dbService.getLastFetchTime();
    const now = Date.now();

    const hasProducts = savedProducts.length > 0;
    const cacheIsFresh =
      lastFetchTime !== null && now - lastFetchTime < this.fourHours;

    if (hasProducts && cacheIsFresh) {
      return savedProducts;
    }

    const apiProducts: any[] = await firstValueFrom(
      this.http.get<any[]>(this.apiUrl)
    );

    const products: CartItem[] = apiProducts.map(product => ({
      id: product.id,
      name: product.title,
      price: Math.round(product.price),
      quantity: 0,
      category: product.category,
      image: product.image,
      description: product.description,
      rating: product.rating?.rate || 0,
      color: product.color,
      sizes: product.sizes,
      stock: product.stock,
      isFavorite: false
    }));

    await this.dbService.saveProducts(products);
    await this.dbService.saveLastFetchTime(now);

    return products;
  }
}