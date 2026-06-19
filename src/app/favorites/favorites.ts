import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { DbService, CartItem } from '../services/db.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class FavoritesComponent implements OnInit {
  private dbService = inject(DbService);
  private changeDetector = inject(ChangeDetectorRef);

  items: CartItem[] = [];
  loading = true;

  async ngOnInit(): Promise<void> {
    await this.dbService.initDB();
    const products = await this.dbService.getProducts();

    this.items = products.filter(item => item.isFavorite);

    this.loading = false;
    this.changeDetector.detectChanges();
  }

  get favoriteItems(): CartItem[] {
    return this.items.filter(item => item.isFavorite);
  }

  formatCategory(category: string): string {
    if (category === 'jewelery') return 'Jewelry';

    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async toggleFavorite(item: CartItem): Promise<void> {
    item.isFavorite = !item.isFavorite;

    await this.dbService.initDB();
    const allProducts = await this.dbService.getProducts();

    const updatedProducts = allProducts.map(product =>
      product.id === item.id ? { ...product, isFavorite: item.isFavorite } : product
    );

    await this.dbService.saveProducts(updatedProducts);

    this.items = updatedProducts.filter(product => product.isFavorite);
    this.changeDetector.detectChanges();
  }

  async addToCart(item: CartItem): Promise<void> {
    await this.dbService.initDB();
    const allProducts = await this.dbService.getProducts();

    const updatedProducts = allProducts.map(product =>
      product.id === item.id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );

    await this.dbService.saveProducts(updatedProducts);

    const updatedItem = updatedProducts.find(product => product.id === item.id);
    if (updatedItem) {
      item.quantity = updatedItem.quantity;
    }

    this.changeDetector.detectChanges();
  }

  async decreaseFromCart(item: CartItem): Promise<void> {
    if (item.quantity <= 0) return;

    await this.dbService.initDB();
    const allProducts = await this.dbService.getProducts();

    const updatedProducts = allProducts.map(product =>
      product.id === item.id
        ? { ...product, quantity: Math.max(product.quantity - 1, 0) }
        : product
    );

    await this.dbService.saveProducts(updatedProducts);

    const updatedItem = updatedProducts.find(product => product.id === item.id);
    if (updatedItem) {
      item.quantity = updatedItem.quantity;
    }

    this.changeDetector.detectChanges();
  }
}