import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, query, where, getDocs, collectionData, orderBy, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Order } from '../models/order.model';
import { CartItem } from '../models/cart-item.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersCollection: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.ordersCollection = collection(this.firestore, 'orders');
  }

  async createOrder(items: CartItem[], totalAmount: number): Promise<string | null> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('A rendelés leadásához bejelentkezés szükséges.');
    }

    const newOrderData: Omit<Order, 'id'> = {
      userId: currentUser.uid,
      items: items,
      totalAmount: totalAmount,
      orderDate: serverTimestamp(),
      status: 'pending' // Alapértelmezett státusz
      // Itt adhatnád hozzá a szállítási címet, stb.
    };

    try {
      const docRef = await addDoc(this.ordersCollection, newOrderData);
      console.log('Rendelés sikeresen létrehozva, ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Hiba a rendelés létrehozásakor:', error);
      throw error;
    }
  }

  // Adott felhasználó összes rendelésének lekérdezése (dátum szerint csökkenő sorrendben)
  getUserOrders(userId: string): Observable<Order[]> {
    const q = query(this.ordersCollection, where('userId', '==', userId), orderBy('orderDate', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  // Adott felhasználó rendeléseinek számának lekérdezése
  async getUserOrdersCount(userId: string): Promise<number> {
    const q = query(this.ordersCollection, where('userId', '==', userId));
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error("Hiba a rendelések számának lekérdezésekor:", error);
      return 0; // Hiba esetén 0-t adunk vissza
    }
  }
}
