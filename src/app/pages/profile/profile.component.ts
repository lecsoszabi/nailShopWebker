import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { AppUser } from '../../models/app-user.model';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router'; // Router importálása a kijelentkezés utáni navigációhoz

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: AppUser | null = null;
  ordersCount: number = 0;
  isLoading: boolean = true;
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router // Router injektálása
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(async user => {
      this.currentUser = user;
      if (user) {
        // A 'createdAt' mezőnek az AppUser objektumon kell lennie,
        // amit az AuthService a Firestore 'users' kollekciójából tölt be
        // vagy a regisztrációkor beállít.
        try {
          this.ordersCount = await this.orderService.getUserOrdersCount(user.uid);
        } catch (error) {
          console.error("Hiba a rendelések számának lekérdezésekor:", error);
          this.ordersCount = 0; // Hiba esetén 0
        }
      } else {
        this.ordersCount = 0;
      }
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Getter a felhasználó kezdőbetűjéhez
  get userInitial(): string {
    if (this.currentUser) {
      if (this.currentUser.displayName && this.currentUser.displayName.length > 0) {
        return this.currentUser.displayName.charAt(0).toUpperCase();
      } else if (this.currentUser.email && this.currentUser.email.length > 0) {
        return this.currentUser.email.charAt(0).toUpperCase();
      }
    }
    return 'U'; // Alapértelmezett, ha nincs elérhető adat
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      // Kijelentkezés után navigálhatunk a kezdőlapra vagy a login oldalra
      this.router.navigate(['/login']); // Példa: átirányítás a login oldalra
    } catch (error) {
      console.error("Hiba kijelentkezéskor:", error);
      // Itt lehetne egy InfoModal hívás is a felhasználónak
    }
  }
}
