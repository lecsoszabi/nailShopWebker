import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model'; // Product modell importálása

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.css']
})
export class AddProductModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() productAddedEvent = new EventEmitter<Omit<Product, 'id' | 'createdAt'>>(); // Csak az adatokat küldjük, ID-t és createdAt-ot a service adja

  @ViewChild('productDialog') dialog!: ElementRef<HTMLDialogElement>;

  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      color: [''],
      length: [null, Validators.min(0)],
      description: [''],
      imageUrl: [''],
      stock: [null, Validators.min(0)]
    });
  }

  ngAfterViewInit() {
    // A dialógus megjelenítése a komponens inicializálása után
    // A showModal() blokkoló modált hoz létre
    this.dialog.nativeElement.showModal();
  }

  closeModal(): void {
    this.dialog.nativeElement.close();
    this.closeModalEvent.emit();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      // Érintetté tesszük a mezőket a hibaüzenetek megjelenítéséhez
      Object.values(this.productForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.productAddedEvent.emit(this.productForm.value);
    this.closeModal(); // Bezárjuk a modált a sikeres hozzáadás után
  }
}
