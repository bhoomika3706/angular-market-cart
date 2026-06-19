import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService, CartItem } from '../services/db.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private dbService = inject(DbService);
  private productService = inject(ProductService);
  private changeDetector = inject(ChangeDetectorRef);

  items: CartItem[] = [];
  searchText = '';
  selectedCategory = 'All Categories';
  selectedColor = 'All Colors';
  selectedPrice = 'All Prices';
  selectedSort = 'Sort By';

  darkMode = false;
  loading = true;
  selectedItem: CartItem | null = null;
  addedMessage = '';

  priceRanges = ['All Prices', 'Under ₹500', '₹500 - ₹1500', 'Above ₹1500'];

  sortOptions = [
    'Sort By',
    'Price Low to High',
    'Price High to Low',
    'Rating High to Low',
    'Name A to Z'
  ];

  async ngOnInit(): Promise<void> {
    try {
      const backendProducts = await this.productService.loadProducts();

      this.items = backendProducts.map(item => ({
        ...item,
        color: this.normalizeColor(item.color, item.name, item.category),
        quantity: item.quantity || 0,
        isFavorite: item.isFavorite || false
      }));

      await this.dbService.saveProducts(this.items);
    } catch (error) {
      console.error('Products could not be loaded:', error);
    } finally {
      this.loading = false;
      this.changeDetector.detectChanges();
    }
  }

  get categories(): string[] {
    const categoryList = this.items
      .map(item => item.category)
      .filter((category): category is string => !!category);

    return ['All Categories', ...new Set(categoryList)];
  }

  get colors(): string[] {
    return ['All Colors', 'Black', 'Blue', 'Brown', 'Gold', 'Silver', 'White'];
  }

  get cartCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get filteredItems(): CartItem[] {
    let result = this.items.filter(item => {
      const itemColor = this.normalizeColor(item.color, item.name, item.category);

      const matchesSearch = item.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All Categories' ||
        item.category === this.selectedCategory;

      const matchesColor =
        this.selectedColor === 'All Colors' ||
        itemColor === this.selectedColor;

      const matchesPrice =
        this.selectedPrice === 'All Prices' ||
        (this.selectedPrice === 'Under ₹500' && item.price < 500) ||
        (this.selectedPrice === '₹500 - ₹1500' &&
          item.price >= 500 &&
          item.price <= 1500) ||
        (this.selectedPrice === 'Above ₹1500' && item.price > 1500);

      return matchesSearch && matchesCategory && matchesColor && matchesPrice;
    });

    if (this.selectedSort === 'Price Low to High') {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (this.selectedSort === 'Price High to Low') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (this.selectedSort === 'Rating High to Low') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (this.selectedSort === 'Name A to Z') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }

  normalizeColor(color?: string, name?: string, category?: string): string {
    const productColor = (color || '').toLowerCase();
    const productName = (name || '').toLowerCase();
    const productCategory = (category || '').toLowerCase();

    if (productColor.includes('black')) return 'Black';
    if (productColor.includes('blue')) return 'Blue';
    if (productColor.includes('brown')) return 'Brown';
    if (productColor.includes('gold')) return 'Gold';
    if (productColor.includes('silver')) return 'Silver';
    if (productColor.includes('white')) return 'White';

    if (productName.includes('backpack')) return 'Blue';
    if (productName.includes('premium') || productName.includes('slim')) return 'Black';
    if (productName.includes('jacket')) return 'Brown';
    if (productName.includes('bracelet')) return 'Gold';
    if (productName.includes('ring')) return 'Silver';
    if (productName.includes('drive') || productName.includes('ssd')) return 'Black';
    if (productName.includes('monitor')) return 'Black';

    if (productCategory === 'jewelery') return 'Gold';
    if (productCategory === 'electronics') return 'Black';
    if (productCategory === "men's clothing") return 'Blue';
    if (productCategory === "women's clothing") return 'White';

    return 'Black';
  }

  formatCategory(category: string): string {
    if (category === 'jewelery') return 'Jewelry';

    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async addToCart(item: CartItem): Promise<void> {
    item.quantity++;
    await this.dbService.saveProducts(this.items);

    this.addedMessage = `${item.name} added to cart`;
    this.changeDetector.detectChanges();

    setTimeout(() => {
      this.addedMessage = '';
      this.changeDetector.detectChanges();
    }, 1800);
  }

  async decreaseFromCart(item: CartItem): Promise<void> {
    if (item.quantity > 0) {
      item.quantity--;
      await this.dbService.saveProducts(this.items);
    }
  }

  async toggleFavorite(item: CartItem): Promise<void> {
    item.isFavorite = !item.isFavorite;
    await this.dbService.saveProducts(this.items);
  }

  openProductInfo(item: CartItem): void {
    this.selectedItem = item;
  }

  closeProductInfo(): void {
    this.selectedItem = null;
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
  }

  onImageError(event: Event): void {
    const imageElement = event.target as HTMLImageElement;
    imageElement.src =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
          <rect width="100%" height="100%" fill="#f1f5f9"/>
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
            font-family="Arial" font-size="22" fill="#64748b">
            Product Image
          </text>
        </svg>
      `);
  }
}