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
    this.items = await this.dbService.getProducts();

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
    return ['All Colors', 'Black', 'Blue', 'Gold', 'Silver', 'White'];
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
        (this.selectedPrice === '₹50 - ₹100' && item.price >= 50 && item.price <= 100) ||
        (this.selectedPrice === 'Above ₹100' && item.price > 100);

      return matchesSearch && matchesCategory && matchesColor && matchesPrice;
    });
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

  getShortDescription(description?: string): string {
    if (!description) {
      return 'This product is designed for everyday use with a clean look, practical build, and reliable quality. It offers a simple balance of comfort, style, and usefulness, making it a good choice for shoppers who want something functional, affordable, and easy to include in their daily routine.';
    }

    const words = description.split(' ');

    if (words.length <= 60) {
      return description;
    }

    return words.slice(0, 60).join(' ') + '...';
  }

  async addToCart(item: CartItem): Promise<void> {
    item.quantity++;
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