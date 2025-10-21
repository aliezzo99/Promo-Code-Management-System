import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromoCodeService } from '../../services/promo-code.service';
import { PromoCode } from '../../models/promo-code.model';

@Component({
  selector: 'app-promo-code-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Promo Code Reports</h2>

      <div class="filter-container">
        <div class="form-group">
          <label for="code">Code</label>
          <input
            type="text"
            id="code"
            name="code"
            [(ngModel)]="filters.code"
            placeholder="Search by code"
          />
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select
            id="status"
            name="status"
            [(ngModel)]="filters.status"
          >
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </div>

        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            [(ngModel)]="filters.startDate"
          />
        </div>

        <div class="form-group">
          <label for="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            [(ngModel)]="filters.endDate"
          />
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <button class="btn btn-primary" (click)="applyFilters()">Apply Filters</button>
        <button class="btn btn-secondary" style="margin-left: 10px;" (click)="clearFilters()">Clear</button>
      </div>

      <div *ngIf="loading" class="loading">Loading...</div>

      <table *ngIf="!loading && promoCodes.length > 0">
        <thead>
          <tr>
            <th>Code</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Expiry Date</th>
            <th>Usage Count</th>
            <th>Usage Limit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let promo of promoCodes">
            <td>{{ promo.code }}</td>
            <td>{{ promo.amount }}</td>
            <td>{{ promo.discountType }}</td>
            <td>{{ promo.expiryDate }}</td>
            <td>{{ promo.usageCount }}</td>
            <td>{{ promo.usageLimit || 'Unlimited' }}</td>
            <td>
              <span class="badge" [ngClass]="{
                'badge-success': promo.status === 'ACTIVE',
                'badge-danger': promo.status === 'EXPIRED',
                'badge-warning': promo.status === 'DISABLED'
              }">{{ promo.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && promoCodes.length === 0">
        <p>No promo codes found matching the filters.</p>
      </div>
    </div>
  `
})
export class PromoCodeReportComponent implements OnInit {
  promoCodes: PromoCode[] = [];
  loading = true;
  filters = {
    code: '',
    status: '',
    startDate: '',
    endDate: ''
  };

  constructor(private promoCodeService: PromoCodeService) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.loading = true;
    this.promoCodeService.getPromoCodesReport(this.filters).subscribe({
      next: (data) => {
        this.promoCodes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading report:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.loadReport();
  }

  clearFilters() {
    this.filters = {
      code: '',
      status: '',
      startDate: '',
      endDate: ''
    };
    this.loadReport();
  }
}
