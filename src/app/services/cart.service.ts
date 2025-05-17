import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc, DocumentData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { AppUser } from '../models/app-user.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSource = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSource.asObservable();
  private currentUserUid: string | null = null;

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserUid = user ? user.uid : null;
      if (this.currentUserUid) {
        this.loadCartForCurrentUser(); // Betöltjük a kosarat, amikor a felhasználó változik
      } else {
        this.cartItemsSource.next([]); // Kijelentkezéskor ürítjük a kosarat
      }
    });
  }

  // Ezt a metódust hívhatja a komponens, ha explicit frissítést akar
  async loadCartForCurrentUser(): Promise<void> {
    if (!this.currentUserUid) {
      this.cartItemsSource.next([]);
      return;
    }
    const cartDocRef = doc(this.firestore, `userCarts/${this.currentUserUid}`);
    try {
      const docSnap = await getDoc(cartDocRef);
      if (docSnap.exists()) {
        const cartData = docSnap.data() as { items?: CartItem[] };
        this.cartItemsSource.next(cartData.items || []);
      } else {
        this.cartItemsSource.next([]); // Ha nincs dokumentum, a kosár üres
      }
    } catch (error) {
      console.error("Hiba a kosár betöltésekor:", error);
      this.cartItemsSource.next([]); // Hiba esetén is üres kosarat mutatunk
    }
  }

  async addToCart(product: Product, quantity: number = 1): Promise<void> {
    if (!this.currentUserUid) {
      throw new Error("Nincs bejelentkezett felhasználó a kosárhoz adáshoz!");
    }

    const cartDocRef = doc(this.firestore, `userCarts/${this.currentUserUid}`);
    const currentItems = [...this.cartItemsSource.value];
    const existingItemIndex = currentItems.findIndex(item => item.productId === product.id);

    const newItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity
    };

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      currentItems.push(newItem);
    }
    // Az setDoc {merge: true} helyett a teljes tömböt írjuk felül,
    // mert a BehaviorSubject-nek is a teljes új állapot kell.
    await setDoc(cartDocRef, { items: currentItems });
    this.cartItemsSource.next(currentItems);
  }

  async removeFromCart(productId: string): Promise<void> {
    if (!this.currentUserUid) throw new Error("Nincs bejelentkezett felhasználó!");

    const cartDocRef = doc(this.firestore, `userCarts/${this.currentUserUid}`);
    const currentItems = this.cartItemsSource.value.filter(item => item.productId !== productId);

    await setDoc(cartDocRef, { items: currentItems });
    this.cartItemsSource.next(currentItems);
  }

  async updateQuantity(productId: string, newQuantity: number): Promise<void> {
    if (!this.currentUserUid) throw new Error("Nincs bejelentkezett felhasználó!");
    if (newQuantity < 0) return; // Érvénytelen mennyiség

    const cartDocRef = doc(this.firestore, `userCarts/${this.currentUserUid}`);
    const currentItems = [...this.cartItemsSource.value];
    const itemIndex = currentItems.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      if (newQuantity === 0) { // Ha a mennyiség 0, töröljük a terméket
        currentItems.splice(itemIndex, 1);
      } else {
        currentItems[itemIndex].quantity = newQuantity;
      }
      await setDoc(cartDocRef, { items: currentItems });
      this.cartItemsSource.next(currentItems);
    }
  }

  async clearCart(): Promise<void> {
    if (!this.currentUserUid) throw new Error("Nincs bejelentkezett felhasználó!");

    const cartDocRef = doc(this.firestore, `userCarts/${this.currentUserUid}`);
    await setDoc(cartDocRef, { items: [] });
    this.cartItemsSource.next([]);
  }
}
