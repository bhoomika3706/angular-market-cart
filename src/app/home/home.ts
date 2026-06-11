import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DbService, CartItem } from '../services/db.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private dbService = inject(DbService);
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

  priceRanges: string[] = [
    'All Prices',
    'Under ₹50',
    '₹50 - ₹100',
    'Above ₹100'
  ];

  sortOptions: string[] = [
    'Sort By',
    'Price Low to High',
    'Price High to Low',
    'Rating High to Low',
    'Name A to Z'
  ];

  async ngOnInit(): Promise<void> {
    await this.dbService.initDB();

    const savedItems = await this.dbService.getProducts();

    this.items = savedItems.map(item => ({
      ...item,
      color: this.getProductColor(item),
      sizes: this.getAvailableSizes(item.category),
      stock: 1000,
      description: this.getProductDescription(item),
      isFavorite: item.isFavorite || false
    }));

    await this.dbService.saveProducts(this.items);

    this.loading = false;
    this.changeDetector.detectChanges();
  }

  get categories(): string[] {
    const categoryList = this.items
      .map(item => item.category)
      .filter((category): category is string => !!category);

    return ['All Categories', ...new Set(categoryList)];
  }

  get colors(): string[] {
    return ['All Colors', 'Black', 'Blue', 'Gold', 'Silver', 'White', 'Brown'];
  }

  get cartCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  get filteredItems(): CartItem[] {
    let result = this.items.filter(item => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All Categories' ||
        item.category === this.selectedCategory;

      const matchesColor =
        this.selectedColor === 'All Colors' ||
        item.color === this.selectedColor;

      const matchesPrice =
        this.selectedPrice === 'All Prices' ||
        (this.selectedPrice === 'Under ₹50' && item.price < 50) ||
        (this.selectedPrice === '₹50 - ₹100' &&
          item.price >= 50 &&
          item.price <= 100) ||
        (this.selectedPrice === 'Above ₹100' && item.price > 100);

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

  getProductColor(item: CartItem): string {
    const name = item.name.toLowerCase();

    if (name.includes('black') || name.includes('premium')) return 'Black';
    if (name.includes('blue') || name.includes('backpack') || name.includes('slim fit')) return 'Blue';
    if (name.includes('gold')) return 'Gold';
    if (name.includes('silver') || name.includes('ssd')) return 'Silver';
    if (name.includes('white')) return 'White';
    if (name.includes('brown') || name.includes('jacket')) return 'Brown';

    if (item.category === 'electronics') return 'Black';
    if (item.category === 'jewelery') return 'Gold';
    if (item.category === "men's clothing") return 'Blue';
    if (item.category === "women's clothing") return 'White';

    return 'Black';
  }

  getAvailableSizes(category?: string): string[] {
    if (category === "men's clothing" || category === "women's clothing") {
      return ['S', 'M', 'L', 'XL'];
    }

    return ['Standard'];
  }

  getProductDescription(item: CartItem): string {
    const name = item.name.toLowerCase();

    if (name.includes('backpack')) {
      return 'A durable everyday backpack with spacious storage, comfortable straps, and a clean design, ideal for laptops, college, office, travel, and daily essentials.';
    }

    if (name.includes('t-shirt') || name.includes('shirt')) {
      return 'A comfortable casual T-shirt with a soft feel and simple fit, perfect for daily wear, college, outings, and relaxed styling.';
    }

    if (name.includes('jacket')) {
      return 'A stylish cotton jacket made for casual layering, offering a neat look, comfortable fit, and easy styling for mild weather.';
    }

    if (name.includes('bracelet')) {
      return 'A polished bracelet designed to add a simple elegant touch to daily outfits, parties, gifting occasions, and casual styling.';
    }

    if (name.includes('ring')) {
      return 'An elegant ring with a classy finish, lightweight feel, and stylish design suitable for daily wear or special occasions.';
    }

    if (name.includes('hard drive') || name.includes('ssd')) {
      return 'A reliable storage device for saving files, photos, projects, and backups, useful for students, professionals, and everyday digital needs.';
    }

    if (name.includes('monitor')) {
      return 'A clear display monitor suitable for study, work, gaming, and entertainment, offering a comfortable viewing experience for daily use.';
    }

    return 'A practical and stylish product selected for everyday shopping, offering useful design, good value, and reliable performance for regular use.';
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
}