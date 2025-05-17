import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Szükséges az async pipe-hoz, *ngIf, *ngFor, number pipe stb.
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { AppUser } from '../../models/app-user.model';
import { AddProductModalComponent } from '../../shared/add-product-modal/add-product-modal.component';
import { EditProductModalComponent } from '../../shared/edit-product-modal/edit-product-modal.component';
import { InfoModalComponent } from '../../shared/info-modal/info-modal.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    CommonModule, // CommonModule szükséges a beépített direktívákhoz és pipe-okhoz
    AddProductModalComponent,
    EditProductModalComponent,
    InfoModalComponent
  ],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  products$!: Observable<Product[]>;
  currentUser: AppUser | null = null;
  isUserLoggedIn: boolean = false;

  showAddProductModal = false;
  showEditProductModal = false;
  productToEdit: Product | null = null;

  showInfoModal = false;
  infoModalTitle = '';
  infoModalMessage = '';
  infoModalType: 'success' | 'error' | 'info' | 'warning' = 'info';

  readonly placeholderProductImage = environment.placeholderImageUrl;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isUserLoggedIn = !!user;
    });
  }

  openAddProductModal(): void {
    this.showAddProductModal = true;
  }

  closeAddProductModal(): void {
    this.showAddProductModal = false;
  }

  async handleProductAdded(productData: Omit<Product, 'id' | 'createdAt' | 'creatorUid'>): Promise<void> {
    try {
      await this.productService.addProduct(productData);
      this.displayInfoModal('Siker', 'Termék sikeresen hozzáadva!', 'success');
    } catch (error: any) {
      this.displayInfoModal('Hiba', error.message || 'Hiba történt a termék hozzáadása közben.', 'error');
    }
    this.closeAddProductModal();
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = this.placeholderProductImage;
    }
  }

  openEditProductModal(product: Product): void {
    if (this.currentUser && product.creatorUid === this.currentUser.uid) {
      this.productToEdit = product;
      this.showEditProductModal = true;
    } else {
      this.displayInfoModal('Jogosultsági hiba', 'Nincs jogosultságod ennek a terméknek a módosításához.', 'error');
    }
  }

  closeEditProductModal(): void {
    this.showEditProductModal = false;
    this.productToEdit = null;
  }

  async handleProductUpdated(updatedData: Partial<Omit<Product, 'id' | 'creatorUid' | 'createdAt'>>): Promise<void> {
    if (!this.productToEdit) {
      this.displayInfoModal('Hiba', 'Nem található a módosítandó termék.', 'error');
      return;
    }
    try {
      await this.productService.updateProduct(this.productToEdit.id, updatedData);
      this.displayInfoModal('Siker', 'Termék sikeresen módosítva!', 'success');
    } catch (error: any) {
      this.displayInfoModal('Hiba', error.message || 'Hiba történt a termék módosítása közben.', 'error');
    }
    this.closeEditProductModal();
  }

  async deleteProduct(productId: string, productName: string, productCreatorUid: string): Promise<void> {
    if (!this.currentUser || productCreatorUid !== this.currentUser.uid) {
      this.displayInfoModal('Jogosultsági hiba', 'Nincs jogosultságod ennek a terméknek a törléséhez.', 'error');
      return;
    }
    if (confirm(`Biztosan törölni szeretnéd a(z) "${productName}" nevű terméket?`)) {
      try {
        await this.productService.deleteProduct(productId);
        this.displayInfoModal('Siker', `"${productName}" sikeresen törölve!`, 'success');
      } catch (error: any) {
        this.displayInfoModal('Hiba', error.message || 'Hiba történt a termék törlése közben.', 'error');
      }
    }
  }

  async addToCart(product: Product): Promise<void> {
    if (!this.isUserLoggedIn) {
      this.displayInfoModal('Figyelmeztetés', 'A kosárba helyezéshez kérjük, jelentkezzen be!', 'warning');
      return;
    }
    try {
      await this.cartService.addToCart(product, 1);
      this.displayInfoModal('Siker', `${product.name} a kosárba került!`, 'success');
    } catch (error) {
      this.displayInfoModal('Hiba', 'Hiba történt a kosárba helyezés során.', 'error');
    }
  }

  displayInfoModal(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.infoModalTitle = title;
    this.infoModalMessage = message;
    this.infoModalType = type;
    this.showInfoModal = true;
  }

  closeInfoModal(): void {
    this.showInfoModal = false;
  }
}
