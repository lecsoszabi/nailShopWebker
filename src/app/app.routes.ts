// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StoreComponent } from './pages/store/store.component';   // <--- IMPORTÁLD
import { CartComponent } from './pages/cart/cart.component';
import {HomeComponent} from './pages/home/home.component';
import {ProfileComponent} from './pages/profile/profile.component';     // <--- IMPORTÁLD
// Importáld a többi oldal komponenst is (HomeComponent, ProfileComponent, PageNotFoundComponent stb.) ha vannak

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'store', component: StoreComponent },   // <--- ADD HOZZÁ
  { path: 'cart', component: CartComponent },     // <--- ADD HOZZÁ
  { path: 'profile', component: ProfileComponent },     // <--- ADD HOZZÁ
  // Példa alapértelmezett útvonalra és "wildcard" útvonalra:
   { path: '', component: HomeComponent , pathMatch: 'full'}, // Ha van HomeComponent
  // { path: '**', component: PageNotFoundComponent } // Ha van PageNotFoundComponent
];
