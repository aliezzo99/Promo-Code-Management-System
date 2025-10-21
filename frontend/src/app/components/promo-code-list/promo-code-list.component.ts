import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PromoCodeService } from '../../services/promo-code.service';
import { PromoCode } from '../../models/promo-code.model';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-promo-code-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Promo Codes</h2>
        <button *ngIf="isAdmin" class="btn btn-primary" (click)="createNew()">Create New</button>
      </div>

      <div *ngIf="loading" class="loading">Loading...</div>

      <table *ngIf="!loading && promoCodes.length > 0">
        <thead>
          <tr>
            <th>Code</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Expiry Date</th>
            <th>Usage</th>
            <th>Status</th>
            <th *ngIf="isAdmin">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let promo of promoCodes">
            <td>{{ promo.code }}</td>
            <td>{{ promo.amount }}</td>
            <td>{{ promo.discountType }}</td>
            <td>{{ promo.expiryDate }}</td>
            <td>{{ promo.usageCount }} / {{ promo.usageLimit || 'Unlimited' }}</td>
            <td>
              <span class="badge" [ngClass]="{
                'badge-success': promo.status === 'ACTIVE',
                'badge-danger': promo.status === 'EXPIRED',
                'badge-warning': promo.status === 'DISABLED'
              }">{{ promo.status }}</span>
            </td>
            <td *ngIf="isAdmin">
              <div class="actions">
                <button class="btn btn-primary" (click)="edit(promo.id!)">Edit</button>
                <button class="btn btn-danger" (click)="delete(promo.id!)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && promoCodes.length === 0">
        <p>No promo codes found.</p>
      </div>
    </div>
  `
})
export class PromoCodeListComponent implements OnInit {
  promoCodes: PromoCode[] = [];
  loading = true;
  isAdmin = false;

  constructor(
    private promoCodeService: PromoCodeService,
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.isAdmin = this.keycloakService.isUserInRole('ADMIN');
    this.loadPromoCodes();
  }

  loadPromoCodes() {
    this.loading = true;
    this.promoCodeService.getAllPromoCodes().subscribe({
      next: (data) => {
        this.promoCodes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading promo codes:', error);
        this.loading = false;
      }
    });
  }

  createNew() {
    this.router.navigate(['/promo-codes/new']);
  }

  edit(id: number) {
    this.router.navigate(['/promo-codes/edit', id]);
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this promo code?')) {
      this.promoCodeService.deletePromoCode(id).subscribe({
        next: () => {
          this.loadPromoCodes();
        },
        error: (error) => {
          console.error('Error deleting promo code:', error);
        }
      });
    }
  }
}
