// src/app/models/user.model.ts

export interface AppUser {
  uid: string;                // Firebase Authentication User ID (ez a legfontosabb azonosító)
  email: string | null;       // Email cím (a Firebase User objektumból származik, lehet null)
  displayName?: string | null; // Megjelenítendő név (Firebase User objektumból, opcionális, lehet null)
  // Itt adhatsz hozzá további, alkalmazás-specifikus felhasználói adatokat,
  // amelyeket Firestore-ban szeretnél tárolni a felhasználóhoz kapcsolódóan.
  // Például:
  // firstName?: string;
  // lastName?: string;
  // address?: {
  //   street: string;
  //   city: string;
  //   zipCode: string;
  //   country: string;
  // };
  // phoneNumber?: string;
  // roles?: string[]; // Pl. ['customer', 'admin']
  // createdAt?: Date; // Mikor regisztrált a felhasználó (alkalmazás szinten)
}
