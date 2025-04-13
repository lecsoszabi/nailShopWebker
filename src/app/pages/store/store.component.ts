import { Component } from '@angular/core';
import descriptions from '../../database/descriptions';
import nails from '../../database/nails';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';

@Component({
  selector: 'app-store',
  imports: [MatCard,MatCardContent,MatCardHeader,MatCardSubtitle],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {
  nails = nails
  descriptions = descriptions
  getDescription(id: number) {
    return this.descriptions.find(description => description.nailid === id);
  }
}
