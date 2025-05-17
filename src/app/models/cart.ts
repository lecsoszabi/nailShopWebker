// src/app/models/cart.ts

import { CartItem } from './cart-item.model'; // Feltételezve, hogy a CartItem definiálja a kosárban lévő elemeket

export interface Cart {
  id: string;            // Firestore dokumentum ID-ja (string)
  userId: string;        // Annak a felhasználónak az ID-ja, akihez a kosár tartozik (string)
  items: CartItem[];     // A kosárban lévő termékek tömbje
  totalAmount: number;   // A kosár teljes értéke
  createdAt: Date;       // Létrehozás dátuma
  updatedAt?: Date;      // Utolsó módosítás dátuma (opcionális)
}
