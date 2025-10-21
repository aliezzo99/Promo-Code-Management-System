import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { PromoCode } from '../models/promo-code.model';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {
  private apiUrl = 'http://localhost:8081/api/promo-codes';

  constructor(
    private http: HttpClient,
    private keycloak: KeycloakService
  ) {}

  private async getHeaders(): Promise<HttpHeaders> {
    try {
      // Try to get token using getToken() method
      const token = await this.keycloak.getToken();
      console.log('PromoCodeService - getToken() result:', !!token);

      if (!token) {
        // Fallback: try to get from Keycloak instance directly
        const instance = this.keycloak.getKeycloakInstance();
        const instanceToken = instance?.token;
        console.log('PromoCodeService - Instance token:', !!instanceToken);

        if (instanceToken) {
          console.log('PromoCodeService - Using instance token (first 50):', instanceToken.substring(0, 50));
          return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${instanceToken}`
          });
        }
      } else {
        console.log('PromoCodeService - Using getToken() result (first 50):', token.substring(0, 50));
        return new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
      }

      console.error('PromoCodeService - NO TOKEN FOUND!');
      throw new Error('No authentication token available');
    } catch (error) {
      console.error('PromoCodeService - Error getting token:', error);
      throw error;
    }
  }

  getAllPromoCodes(): Observable<PromoCode[]> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => this.http.get<PromoCode[]>(this.apiUrl, { headers }))
    );
  }

  getPromoCodeById(id: number): Observable<PromoCode> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => this.http.get<PromoCode>(`${this.apiUrl}/${id}`, { headers }))
    );
  }

  createPromoCode(promoCode: PromoCode): Observable<PromoCode> {
    console.log('createPromoCode called with:', promoCode);
    return from(this.getHeaders()).pipe(
      switchMap(headers => {
        console.log('Creating promo code with headers:', headers);
        return this.http.post<PromoCode>(this.apiUrl, promoCode, { headers });
      })
    );
  }

  updatePromoCode(id: number, promoCode: PromoCode): Observable<PromoCode> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => this.http.put<PromoCode>(`${this.apiUrl}/${id}`, promoCode, { headers }))
    );
  }

  deletePromoCode(id: number): Observable<void> {
    return from(this.getHeaders()).pipe(
      switchMap(headers => this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }))
    );
  }

  getPromoCodesReport(filters: any): Observable<PromoCode[]> {
    let params = new HttpParams();

    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.code) {
      params = params.set('code', filters.code);
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    return from(this.getHeaders()).pipe(
      switchMap(headers => this.http.get<PromoCode[]>(`${this.apiUrl}/report`, { params, headers }))
    );
  }
}
