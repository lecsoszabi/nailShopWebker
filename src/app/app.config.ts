import { ApplicationConfig, importProvidersFrom } from '@angular/core'; // Az importProvidersFrom itt maradhat más esetleges régebbi modulokhoz, de a Firebase-hez nem kell.
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http'; // Ez rendben van, ha használod

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Szükséges lehet más szolgáltatásokhoz

    // Közvetlenül a providers tömbbe kerülnek, importProvidersFrom NÉLKÜL:
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
    // Ha más Firebase szolgáltatásokat is használsz (pl. Storage, Functions), azokat is ide add hozzá hasonlóan.
  ]
};
