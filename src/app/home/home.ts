import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  items: CartItem[] = [];
  searchText = '';
  selectedCategory = 'All Categories';
  selectedColor = 'All Colors';
  selectedPrice = 'All Prices';
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

  constructor(
    private dbService: DbService,
    private changeDetector: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.dbService.initDB();

    const savedItems = await this.dbService.getProducts();

    this.items = savedItems.map(item => ({
      ...item,
      color: this.getProductColor(item),
      sizes: this.getAvailableSizes(item.category),
      stock: 1000,
      description: this.getProductDescription(item)
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

  get filteredItems(): CartItem[] {
    return this.items.filter(item => {
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
  }

  getProductColor(item: CartItem): string {
    const name = item.name.toLowerCase();

    if (name.includes('black') || name.includes('mens casual premium')) {
      return 'Black';
    }

    if (name.includes('blue') || name.includes('backpack') || name.includes('slim fit')) {
      return 'Blue';
    }

    if (name.includes('gold')) {
      return 'Gold';
    }

    if (name.includes('silver') || name.includes('ssd')) {
      return 'Silver';
    }

    if (name.includes('white')) {
      return 'White';
    }

    if (name.includes('brown') || name.includes('jacket')) {
      return 'Brown';
    }

    if (item.category === 'electronics') {
      return 'Black';
    }

    if (item.category === 'jewelery') {
      return 'Gold';
    }

    if (item.category === "men's clothing") {
      return 'Blue';
    }

    if (item.category === "women's clothing") {
      return 'White';
    }

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

    if (name.includes('women')) {
      return 'A stylish women’s product with a clean look and comfortable feel, suitable for casual use, outings, and everyday styling.';
    }

    return 'A practical and stylish product selected for everyday shopping, offering useful design, good value, and reliable performance for regular use.';
  }

  formatCategory(category: string): string {
    if (category === 'jewelery') {
      return 'Jewelry';
    }

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