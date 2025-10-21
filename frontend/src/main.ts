import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'promo-system',
        clientId: 'promo-frontend'
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      },
      loadUserProfileAtStartUp: false
    }).then(() => {
      console.log('Keycloak initialized successfully');
      console.log('Authenticated:', keycloak.isLoggedIn());
      console.log('Token available:', !!keycloak.getKeycloakInstance().token);
    }).catch(error => {
      console.error('Keycloak initialization error:', error);
    });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ]
}).catch(err => console.error(err));
