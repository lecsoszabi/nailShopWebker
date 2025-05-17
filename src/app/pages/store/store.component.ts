import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ha használsz *ngIf, *ngFor stb.

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule], // Szükséges importok
  template: `
    <h2>Bolt</h2>
    <p>Itt lesznek a termékek listázva.</p>
  `,
  // styleUrls: ['./store.component.css'] // Ha van külön CSS
})
export class StoreComponent {
  // Itt jön majd a terméklistázás logikája
}
