// src/app/models/description.model.ts

export interface Description {
  id: string;           // A leírás egyedi azonosítója (ha külön kollekcióban tárolod)
  // Vagy lehet, hogy nincs is rá szükség, ha beágyazod a Nail-be.
  title: string;        // A leírás címe
  text: string;         // A leírás szövege
  nailId: string;       // Annak a "nail"-nek (műkörömnek) az ID-ja, amelyhez ez a leírás tartozik
  // Ez segít összekapcsolni a leírást a megfelelő termékkel.
  // Esetleg további mezők:
  // language?: string;    // Ha többnyelvű leírások vannak
  // position?: number;    // Ha egy termékhez több leírás is tartozhat, és sorrendjük van
}
