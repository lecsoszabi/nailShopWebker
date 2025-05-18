export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  createdAt?: any; // Firestore Timestamp a regisztráció időpontjához
  // Egyéb alkalmazás-specifikus mezők
}
