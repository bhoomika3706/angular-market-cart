import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CartItem } from '../services/db.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  products: CartItem[] = [];
  filteredProducts: CartItem[] = [];

  searchText = '';
  selectedCategory = '';
  selectedColor = '';
  selectedPrice = '';
  selectedSort = '';

  categories: string[] = [];
  colors: string[] = [];

  loading = true;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private changeDetector: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.products = await this.productService.loadProducts();

      this.categories = [
        ...new Set(this.products.map(product => product.category || ''))
      ].filter(category => category !== '');

      this.colors = [
        ...new Set(this.products.map(product => product.color || ''))
      ].filter(color => color !== '');

      this.applyFilters();

      console.log('Products loaded:', this.products);
      console.log('Filtered products:', this.filteredProducts);
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Products could not be loaded.';
    } finally {
      this.loading = false;
      this.changeDetector.detectChanges();
    }
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const name = product.name || '';
      const category = product.category || '';
      const color = product.color || '';

      const matchesSearch =
        name.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesCategory =
        this.selectedCategory === '' || category === this.selectedCategory;

      const matchesColor =
        this.selectedColor === '' || color === this.selectedColor;

      let matchesPrice = true;

      if (this.selectedPrice === 'under500') {
        matchesPrice = product.price < 500;
      } else if (this.selectedPrice === '500to1000') {
        matchesPrice = product.price >= 500 && product.price <= 1000;
      } else if (this.selectedPrice === 'above1000') {
        matchesPrice = product.price > 1000;
      }

      return matchesSearch && matchesCategory && matchesColor && matchesPrice;
    });

    if (this.selectedSort === 'lowToHigh') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort === 'highToLow') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }

    this.changeDetector.detectChanges();
  }
}