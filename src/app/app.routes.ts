import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {CartComponent} from './pages/cart/cart.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {StoreComponent} from './pages/store/store.component';
import {PagenotfoundComponent} from './shared/pagenotfound/pagenotfound.component';

export const routes: Routes = [
  {path : 'home' , component: HomeComponent},
  {path : 'cart' , component: CartComponent},
  {path : 'profile' , component: ProfileComponent},
  {path : 'store' , component: StoreComponent},
  {path : '' , component: HomeComponent},
  {path : '**' , component: PagenotfoundComponent},
];
