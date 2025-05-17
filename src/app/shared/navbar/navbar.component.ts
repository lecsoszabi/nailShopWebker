// src/app/shared/navbar/navbar.component.ts
import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AppUser } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser$: Observable<AppUser | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
    this.router = router;
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      // Ide jöhet navigáció a login oldalra, ha szükséges
      console.log('Sikeres kijelentkezés');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Kijelentkezési hiba', error);
    }
  }
}
