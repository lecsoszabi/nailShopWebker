export interface Product {
  id: string;
  name: string;
  price: number;
  color?: string;
  length?: number;
  description?: string;
  imageUrl?: string;
  stock?: number;
  createdAt?: any; // Firestore Timestamp
  creatorUid: string; // A terméket létrehozó felhasználó UID-ja
}
