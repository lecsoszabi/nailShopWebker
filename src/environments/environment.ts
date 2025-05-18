// src/environments/environment.ts

export const environment = {
  production: false,
  // A 'firebase' kulcsnak itt kell lennie, és tartalmaznia kell a konfigurációs adatokat
  firebase: {
    apiKey: "AIzaSyBwRnI3otyDeT5Nbl-EJt1gqUqIqnwV5C0", // Ezek a te adataid, rendben vannak
    authDomain: "nailshopangular.firebaseapp.com",
    projectId: "nailshopangular",
    storageBucket: "nailshopangular.firebasestorage.app", // Itt a ".firebasestorage.app" helyett ".appspot.com" szokott lenni, de ha a Firebase ezt adta, akkor ez a jó. Ellenőrizd a Firebase Console-ban.
    messagingSenderId: "526806258935",
    appId: "1:526806258935:web:f444455b24551e46472ff2"
    // measurementId: "G-XXXXXXXXXX" // Ha használsz Google Analytics for Firebase-t
  },


  placeholderImageUrl: "assets/images/placeholder-nail.png",

};
