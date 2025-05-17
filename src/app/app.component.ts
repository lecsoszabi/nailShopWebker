import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component'; // Feltételezve, hogy van Navbar

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent], // RouterOutlet a routinghoz
  template: `
    <app-navbar></app-navbar>
    <main class="container mx-auto p-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nailshop';
}
