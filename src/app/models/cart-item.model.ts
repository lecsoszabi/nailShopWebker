export interface CartItem {
  productId: string;
  quantity: number;
  name: string;       // Denormalizált a Product-ból
  price: number;      // Denormalizált a Product-ból (az ár a kosárba tételkor)
  imageUrl?: string; // Denormalizált a Product-ból
}
