import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DbService, CartItem } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(
    private http: HttpClient,
    private dbService: DbService
  ) {}

  async loadProducts(): Promise<CartItem[]> {
    await this.dbService.initDB();

    const apiProducts: any[] = await firstValueFrom(
      this.http.get<any[]>(this.apiUrl)
    );

    const oldProducts = await this.dbService.getProducts();

    const products: CartItem[] = apiProducts.map(product => {
      const oldProduct = oldProducts.find(item => item.id === product.id);

      return {
        id: product.id,
        name: product.title,
        price: Math.round(product.price),
        quantity: oldProduct?.quantity || 0,
        category: product.category,
        image: product.image,
        description: product.description,
        rating: product.rating || 0,
        color: product.color,
        sizes: product.sizes || [],
        stock: product.stock || 0,
        isFavorite: oldProduct?.isFavorite || false
      };
    });

    await this.dbService.saveProducts(products);
    await this.dbService.saveLastFetchTime(Date.now());

    return products;
  }
}