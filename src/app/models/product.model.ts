// src/app/models/product.model.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  color?: string;
  length?: number | null;
  stock?: number | null;
  creatorUid: string;
  createdAt?: any;
  updatedAt?: any;
}
