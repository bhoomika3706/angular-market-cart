import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { CartComponent } from './cart/cart';
import { ProfileComponent } from './profile/profile';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent }
];