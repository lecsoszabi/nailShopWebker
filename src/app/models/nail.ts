// src/app/models/nail.model.ts
// Ez gyakorlatilag a Product modelled lesz, "Nail" specifikus attribútumokkal, ha vannak.

export interface Nail {
  id: string;                 // A műköröm/termék egyedi azonosítója (Firestore dokumentum ID)
  name: string;               // A műköröm/termék neve (ez hiányzott, de egy terméknek általában van neve)
  color: string;              // A műköröm színe
  length: number;             // A műköröm hossza (javítva az elírást)
  price: number;              // Ár
  descriptionId?: string;     // Annak a Description entitásnak az ID-ja, amely ehhez a műkörömhöz tartozik (opcionális)
  // Ha minden nail-hez van leírás, akkor ne legyen opcionális.
  imageUrl?: string;          // Kép URL-je (opcionális, de webshopban gyakori)
  stock?: number;             // Készletinformáció (opcionális)
  // Egyéb "Nail" specifikus tulajdonságok ide jöhetnek
}
