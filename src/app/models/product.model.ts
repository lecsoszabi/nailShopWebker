export interface Product {
  id: string; // Firestore dokumentum ID
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}
