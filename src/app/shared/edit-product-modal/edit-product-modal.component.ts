import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-edit-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['../add-product-modal/add-product-modal.component.css'] // Újrahasználhatjuk az add-modal CSS-ét, vagy készíthetünk sajátot
})
export class EditProductModalComponent implements AfterViewInit, OnChanges {
  @Input() productToEdit: Product | null = null; // Bemenet a módosítandó termék
  @Input() showModal: boolean = false;

  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() productUpdatedEvent = new EventEmitter<Partial<Omit<Product, 'id' | 'creatorUid' | 'createdAt'>>>();

  @ViewChild('editProductDialog') dialog!: ElementRef<HTMLDialogElement>;

  productForm!: FormGroup; // A ! jelzi, hogy később inicializáljuk (ngOnChanges)

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  private initializeForm(product?: Product): void {
    this.productForm = this.fb.group({
      name: [product?.name || '', Validators.required],
      price: [product?.price ?? null, [Validators.required, Validators.min(0)]],
      color: [product?.color || ''],
      length: [product?.length ?? null, Validators.min(0)],
      description: [product?.description || ''],
      imageUrl: [product?.imageUrl || ''],
      stock: [product?.stock ?? null, Validators.min(0)]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productToEdit'] && this.productToEdit) {
      this.initializeForm(this.productToEdit); // Form feltöltése a termék adataival
    }
    if (changes['showModal'] && this.dialog?.nativeElement) {
      if (this.showModal) {
        this.openDialog();
      } else {
        this.closeDialogInternal();
      }
    }
  }

  ngAfterViewInit() {
    if (this.showModal) {
      this.openDialog();
    }
  }

  private openDialog(): void {
    if (this.dialog?.nativeElement && !this.dialog.nativeElement.open) {
      this.dialog.nativeElement.showModal();
    }
  }

  private closeDialogInternal(): void {
    if (this.dialog?.nativeElement && this.dialog.nativeElement.open) {
      this.dialog.nativeElement.close();
    }
  }

  closeModal(): void {
    this.closeDialogInternal();
    this.closeModalEvent.emit();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      Object.values(this.productForm.controls).forEach(control => control.markAsTouched());
      return;
    }
    if (this.productToEdit) { // Csak akkor küldjük, ha van mit módosítani
      this.productUpdatedEvent.emit(this.productForm.value);
    }
    this.closeModal();
  }
}
