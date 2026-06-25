import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DbService, CartItem } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://marketcart.onrender.com/products';

  constructor(
    private http: HttpClient,
    private dbService: DbService
  ) {}

 async loadProducts(): Promise<CartItem[]> {
  await this.dbService.initDB();

  const apiProducts = await firstValueFrom(
    this.http.get<any[]>(this.apiUrl)
  );

  const products: CartItem[] = apiProducts.map(product => ({
    id: product.id,
    name: product.title || product.name,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description,
    rating: product.rating?.rate || product.rating || 0,
    quantity: 0,
    color: product.color || 'Default',
    sizes: product.sizes || [],
    stock: product.stock || 1000,
    isFavorite: false
  }));

  await this.dbService.saveProducts(products);

  return products;
}
}