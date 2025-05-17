import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteField, DocumentData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSource = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSource.asObservable();

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCart(user.uid);
      } else {
        this.cartItemsSource.next([]); // Kijelentkezéskor ürítjük a kosarat
      }
    });
  }

  private async loadCart(userId: string): Promise<void> {
    const cartDocRef = doc(this.firestore, `userCarts/${userId}`);
    const docSnap = await getDoc(cartDocRef);
    if (docSnap.exists()) {
      const cartData = docSnap.data() as { items?: CartItem[] };
      this.cartItemsSource.next(cartData.items || []);
    } else {
      this.cartItemsSource.next([]);
    }
  }

  async addToCart(product: Product, quantity: number = 1): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error("Nincs bejelentkezett felhasználó a kosárhoz adáshoz!");
      // Ideális esetben átirányítás a login oldalra vagy hibaüzenet
      return;
    }

    const cartDocRef = doc(this.firestore, `userCarts/${user.uid}`);
    const currentItems = [...this.cartItemsSource.value]; // Klónozzuk a jelenlegi állapotot
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

    await setDoc(cartDocRef, { items: currentItems }, { merge: true });
    this.cartItemsSource.next(currentItems); // Frissítjük a BehaviorSubject-et
  }

  async removeFromCart(productId: string): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const cartDocRef = doc(this.firestore, `userCarts/${user.uid}`);
    const currentItems = this.cartItemsSource.value.filter(item => item.productId !== productId);

    await setDoc(cartDocRef, { items: currentItems }, { merge: true });
    this.cartItemsSource.next(currentItems);
  }

  async updateQuantity(productId: string, newQuantity: number): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const cartDocRef = doc(this.firestore, `userCarts/${user.uid}`);
    const currentItems = [...this.cartItemsSource.value];
    const itemIndex = currentItems.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      if (newQuantity > 0) {
        currentItems[itemIndex].quantity = newQuantity;
      } else {
        currentItems.splice(itemIndex, 1); // Ha 0 vagy kevesebb, töröljük
      }
      await setDoc(cartDocRef, { items: currentItems }, { merge: true });
      this.cartItemsSource.next(currentItems);
    }
  }

  async clearCart(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const cartDocRef = doc(this.firestore, `userCarts/${user.uid}`);
    await setDoc(cartDocRef, { items: [] }); // Üres tömbbel felülírjuk
    this.cartItemsSource.next([]);
  }
}
