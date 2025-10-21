import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);

  // Only add token to backend API calls
  if (!req.url.includes('localhost:8081')) {
    return next(req);
  }

  // Get token synchronously from Keycloak instance
  const keycloakInstance = keycloak.getKeycloakInstance();
  const token = keycloakInstance?.token;

  console.log('Auth Interceptor - URL:', req.url);
  console.log('Auth Interceptor - Token exists:', !!token);
  console.log('Auth Interceptor - Token (first 50 chars):', token?.substring(0, 50));

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Auth Interceptor - Added Authorization header');
    return next(cloned);
  }

  console.log('Auth Interceptor - NO TOKEN, proceeding without Authorization header');
  return next(req);
};
