import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Kosár</h2>
    <p>Itt lesz a kosár tartalma.</p>
  `,
  // styleUrls: ['./cart.component.css']
})
export class CartComponent {
  // Itt jön majd a kosárkezelés logikája
}
