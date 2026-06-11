import { Injectable } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  image?: string;
  description?: string;
  rating?: number;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbName = 'CartDB';
  private productStore = 'products';
  private metaStore = 'meta';
  private db!: IDBDatabase;

  initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 4);

      request.onerror = () => reject('Database failed to open');

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(this.productStore)) {
          db.createObjectStore(this.productStore, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(this.metaStore)) {
          db.createObjectStore(this.metaStore, { keyPath: 'key' });
        }
      };
    });
  }

  saveProducts(products: CartItem[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.productStore, 'readwrite');
      const store = transaction.objectStore(this.productStore);

      store.clear();

      products.forEach(product => store.put(product));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject('Products failed to save');
    });
  }

  getProducts(): Promise<CartItem[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.productStore, 'readonly');
      const store = transaction.objectStore(this.productStore);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as CartItem[]);
      request.onerror = () => reject('Products failed to fetch');
    });
  }

  saveLastFetchTime(time: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.metaStore, 'readwrite');
      const store = transaction.objectStore(this.metaStore);

      store.put({ key: 'lastFetchTime', value: time });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject('Fetch time failed to save');
    });
  }

  getLastFetchTime(): Promise<number | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.metaStore, 'readonly');
      const store = transaction.objectStore(this.metaStore);
      const request = store.get('lastFetchTime');

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };

      request.onerror = () => reject('Fetch time failed to get');
    });
  }
}