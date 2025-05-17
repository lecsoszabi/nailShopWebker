export interface Description {
  id: string;           // Firestore dokumentum ID
  title: string;
  text: string;
  // A productId itt nem feltétlenül szükséges, ha a Product modell hivatkozik erre az ID-re.
  // De ha egy leírás több termékhez is tartozhatna (nem valószínű), akkor igen.
}
