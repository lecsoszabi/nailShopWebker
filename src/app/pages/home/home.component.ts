import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';
import {AppUser} from '../../models/user.model';
import {loggedIn} from '@angular/fire/auth-guard';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentUser$: Observable<AppUser | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
    this.router = router;
  }

  protected readonly loggedIn = loggedIn;
}
