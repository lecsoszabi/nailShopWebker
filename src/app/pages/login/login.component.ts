import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ReactiveFormsModule importálása
import {Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common'; // CommonModule importálása az *ngIf és társaihoz
import { AuthService } from '../../services/auth.service'; // AuthService importálása

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, // Hozzáadás az imports tömbhöz
    CommonModule,
    RouterLink,
    // Hozzáadás az imports tömbhöz
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // A korábban definiált stílusfájl
})
export class LoginComponent {
  loginForm: FormGroup; // Itt deklaráljuk a loginForm tulajdonságot
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]] // A minLength itt is hasznos lehet, de a Firebase kezeli
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = null; // Hibaüzenet törlése minden próbálkozás előtt
    if (this.loginForm.invalid) {
      // Form validáció megjelenítése, ha szükséges
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email!, password!);
      // Sikeres bejelentkezés után navigálhatsz a felhasználói profilra vagy a webshop főoldalára
      this.router.navigate(['/store']); // Példa: átirányítás a bolt oldalra
      // Vagy ha van guard-od és a felhasználó egy védett oldalra akart menni, a guard kezeli az átirányítást.
    } catch (error: any) {
      // Firebase hibaüzenetek kezelése
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        this.errorMessage = 'Hibás email cím vagy jelszó.';
      } else if (error.code === 'auth/too-many-requests') {
        this.errorMessage = 'Túl sok sikertelen bejelentkezési kísérlet. Próbáld újra később.';
      }
      else {
        this.errorMessage = 'Ismeretlen hiba történt a bejelentkezés során. Próbáld újra később.';
      }
      console.error('Login error:', error);
    }
  }
}
