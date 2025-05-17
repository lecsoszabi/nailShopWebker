import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, serverTimestamp, query, orderBy, updateDoc, deleteDoc, DocumentReference, DocumentData, CollectionReference } from '@angular/fire/firestore'; // updateDoc, deleteDoc, DocumentReference importálása
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // AuthService importálása a creatorUid-hez

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore,
    private authService: AuthService // AuthService injektálása
  ) {
    this.productsCollection = collection(this.firestore, 'products');
  }

  getProducts(): Observable<Product[]> {
    const q = query(this.productsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'creatorUid'>): Promise<string> {
    const currentUser = this.authService.getCurrentUser(); // Aktuális felhasználó lekérése
    if (!currentUser) {
      throw new Error('A termék hozzáadásához bejelentkezés szükséges.');
    }

    try {
      const docRef = await addDoc(this.productsCollection, {
        ...productData,
        creatorUid: currentUser.uid, // Létrehozó UID-jának mentése
        createdAt: serverTimestamp()
      });
      console.log("Termék sikeresen hozzáadva, ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Hiba a termék hozzáadásakor: ", error);
      throw error;
    }
  }

  async updateProduct(productId: string, productData: Partial<Omit<Product, 'id' | 'creatorUid' | 'createdAt'>>): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('A termék módosításához bejelentkezés szükséges.');
    }
    // A jogosultság ellenőrzése a Firestore szabályokban fog történni a creatorUid alapján.
    // Itt a kliens oldalon is megtehetnénk egy előzetes ellenőrzést, ha a termék objektum tartalmazza a creatorUid-t.
    const productRef: DocumentReference<DocumentData> = doc(this.firestore, `products/${productId}`);
    try {
      await updateDoc(productRef, {
        ...productData,
        updatedAt: serverTimestamp() // Opcionális: utolsó módosítás időbélyege
      });
      console.log("Termék sikeresen frissítve, ID: ", productId);
    } catch (error) {
      console.error("Hiba a termék frissítésekor: ", error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('A termék törléséhez bejelentkezés szükséges.');
    }
    // A jogosultság ellenőrzése a Firestore szabályokban történik.
    const productRef: DocumentReference<DocumentData> = doc(this.firestore, `products/${productId}`);
    try {
      await deleteDoc(productRef);
      console.log("Termék sikeresen törölve, ID: ", productId);
    } catch (error) {
      console.error("Hiba a termék törlésekor: ", error);
      throw error;
    }
  }
}
