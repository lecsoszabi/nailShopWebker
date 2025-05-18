import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Szükséges az async pipe-hoz, *ngIf, *ngFor, number pipe
import { Observable, Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router'; // RouterLink importálása
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service'; // AuthService importálása
import { InfoModalComponent } from '../../shared/info-modal/info-modal.component'; // InfoModal importálása
import { environment } from '../../../environments/environment';
import {OrderService} from '../../services/order.service'; // Placeholder képhez

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, InfoModalComponent], // RouterLink és InfoModalComponent hozzáadása
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'] // A korábban definiált stílusfájl
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems$!: Observable<CartItem[]>;
  private authSubscription!: Subscription;
  isUserLoggedIn: boolean = false;

  // Információs modális ablak állapota
  showInfoModal = false;
  infoModalTitle = '';
  infoModalMessage = '';
  infoModalType: 'success' | 'error' | 'info' | 'warning' = 'info';

  readonly placeholderProductImage = environment.placeholderImageUrl;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    // AuthService injektálása
    private router: Router // Router injektálása
  ) {}

  ngOnInit(): void {
    // Figyeljük a bejelentkezési állapotot
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isUserLoggedIn = !!user;
      if (this.isUserLoggedIn) {
        // Ha a felhasználó be van jelentkezve, frissítsük a kosarat
        // A CartService konstruktora is betölti, de itt egy explicit frissítést is kérhetünk,
        // hogy biztosan a legfrissebb adatokkal dolgozzunk az oldalra navigáláskor.
        this.cartService.loadCartForCurrentUser();
      } else {
        // Ha nincs bejelentkezett felhasználó, ne próbáljunk kosarat betölteni,
        // és a sablonban kezeljük le, hogy a kosár csak bejelentkezett felhasználóknak elérhető.
        // Vagy átirányíthatjuk a login oldalra.
        // Jelenleg a CartService már üríti a cartItemsSource-t kijelentkezéskor.
      }
    });
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }


  async updateQuantity(productId: string, newQuantity: number): Promise<void> {
    if (!this.isUserLoggedIn) {
      this.displayInfoModal('Figyelmeztetés', 'A művelethez bejelentkezés szükséges.', 'warning');
      return;
    }
    if (newQuantity < 0) return; // Érvénytelen kérés
    try {
      await this.cartService.updateQuantity(productId, newQuantity);
      // Nincs szükség alertre, a lista automatikusan frissül
    } catch (error: any) {
      this.displayInfoModal('Hiba', error.message || 'Hiba történt a mennyiség frissítésekor.', 'error');
    }
  }

  async removeFromCart(productId: string): Promise<void> {
    if (!this.isUserLoggedIn) {
      this.displayInfoModal('Figyelmeztetés', 'A művelethez bejelentkezés szükséges.', 'warning');
      return;
    }
    try {
      await this.cartService.removeFromCart(productId);
      this.displayInfoModal('Siker', 'Termék eltávolítva a kosárból.', 'success');
    } catch (error: any) {
      this.displayInfoModal('Hiba', error.message || 'Hiba történt a termék kosárból való törlésekor.', 'error');
    }
  }

  calculateTotal(items: CartItem[] | null): number {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  async clearCart(): Promise<void> {
    if (!this.isUserLoggedIn) {
      this.displayInfoModal('Figyelmeztetés', 'A művelethez bejelentkezés szükséges.', 'warning');
      return;
    }
    // A confirm() böngésző specifikus, jobb lenne egyedi modális

      try {
        await this.cartService.clearCart();
        this.displayInfoModal('Siker', 'A kosár sikeresen ürítve.', 'success');
      } catch (error: any) {
        this.displayInfoModal('Hiba', error.message || 'Hiba történt a kosár ürítésekor.', 'error');
      }
  }

  async proceedToCheckout(items: CartItem[] | null): Promise<void> { // Async lett
    if (!this.isUserLoggedIn) {
      this.displayInfoModal('Figyelmeztetés', 'A rendeléshez bejelentkezés szükséges.', 'warning');
      this.router.navigate(['/login']);
      return;
    }
    if (!items || items.length === 0) {
      this.displayInfoModal('Információ', 'A kosarad üres, nincs mit megrendelni.', 'info');
      return;
    }

    const totalAmount = this.calculateTotal(items);

    try {
      const orderId = await this.orderService.createOrder(items, totalAmount);
      if (orderId) {
        await this.cartService.clearCart(); // Kosár ürítése sikeres rendelés után
        this.displayInfoModal('Siker', `Rendelésed sikeresen rögzítettük (ID: ${orderId}). Köszönjük a vásárlást!`, 'success');
        // Opcionálisan átirányítás egy "köszönő" oldalra vagy a rendeléseim oldalra
        this.router.navigate(['/profile']); // Példa: profil oldalra navigálás
      } else {
        this.displayInfoModal('Hiba', 'Nem sikerült létrehozni a rendelést.', 'error');
      }
    } catch (error: any) {
      console.error('Hiba a rendelés feldolgozása során:', error);
      this.displayInfoModal('Hiba', error.message || 'Hiba történt a rendelés feldolgozása során.', 'error');
    }
  }

  // --- Info Modal Helper ---
  displayInfoModal(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.infoModalTitle = title;
    this.infoModalMessage = message;
    this.infoModalType = type;
    this.showInfoModal = true;
  }

  closeInfoModal(): void {
    this.showInfoModal = false;
  }
}
