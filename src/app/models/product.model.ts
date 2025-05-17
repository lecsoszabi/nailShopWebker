export interface Product {
  creatorUid: string;
  id: string;                 // Firestore dokumentum ID
  name: string;
  price: number;
  color?: string;              // Specifikus a "Nail"-hez
  length?: number;             // Specifikus a "Nail"-hez
  description?: string;        // Rövid leírás, ami a kártyán megjelenhet
  detailedDescriptionId?: string; // ID a külön Description modellhez, ha van
  imageUrl?: string;
  stock?: number;
}
