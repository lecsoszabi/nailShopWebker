import { CartItem } from './cart-item.model';

export interface Order {
  id: string;             // Firestore dokumentum ID
  userId: string;         // A rendelést leadó felhasználó UID-ja
  items: CartItem[];      // A megrendelt termékek
  totalAmount: number;    // A rendelés végösszege
  orderDate: any;         // Firestore Timestamp a rendelés dátumához
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // Rendelés állapota
  // Opcionális további adatok:
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  // paymentDetails?: any;
}
