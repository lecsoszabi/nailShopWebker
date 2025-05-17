export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  // Egyéb alkalmazás-specifikus mezők
}
