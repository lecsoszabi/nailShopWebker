export interface AppUser { // Azért AppUser, hogy ne ütközzön a Firebase User típusával
  uid: string;
  email: string | null;
  displayName?: string | null;
}
