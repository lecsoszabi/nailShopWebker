export interface CartItem {
  productId: string;
  quantity: number;
  name: string; // Denormalizáljuk a könnyebb megjelenítésért
  price: number; // Denormalizáljuk a könnyebb megjelenítésért
  imageUrl?: string; // Denormalizáljuk a könnyebb megjelenítésért
}
