import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Itt kell deklarálni a registerForm tulajdonságot!
  // A FormGroup típust a @angular/forms csomagból kell importálni.
  registerForm: FormGroup; // VAGY registerForm!: FormGroup; ha a konstruktorban biztosan inicializálod
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, // A FormBuilder-t is importálni kell
    private authService: AuthService,
    private router: Router
  ) {
    // Itt inicializálod a formot
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Egyéni validátor a jelszavak egyezőségének ellenőrzésére
  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = null;
    if (this.registerForm.invalid) {
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const { email, password } = this.registerForm.value;

    try {
      await this.authService.register(email!, password!);
      alert('Sikeres regisztráció! Most már bejelentkezhetsz.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'Ez az email cím már regisztrálva van.';
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage = 'A jelszó túl gyenge. Legalább 6 karakter hosszúnak kell lennie.';
      } else {
        this.errorMessage = 'Ismeretlen hiba történt a regisztráció során. Próbáld újra később.';
      }
      console.error('Register error:', error);
    }
  }
}
