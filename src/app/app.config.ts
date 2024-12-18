import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import lara from '@primeng/themes/lara';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({ 
      theme: {
          preset: lara, 
          options: {
            darkModeSelector: false
          }
      }
  }),
   provideFirebaseApp(() => initializeApp({"projectId":"track-my-budget-7acbb","appId":"1:404877432174:web:2fe56362ecccc0fef01d7f","storageBucket":"track-my-budget-7acbb.firebasestorage.app","apiKey":"AIzaSyBLF9Z8EzyK-rlW00F-aQ0r4QJ7PtrC3O8","authDomain":"track-my-budget-7acbb.firebaseapp.com","messagingSenderId":"404877432174"})),
    provideAuth(() => getAuth()),
     provideFirestore(() => getFirestore())

  ]
};
