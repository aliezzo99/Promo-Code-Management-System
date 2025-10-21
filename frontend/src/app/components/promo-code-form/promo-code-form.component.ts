import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromoCodeService } from '../../services/promo-code.service';
import { PromoCode } from '../../models/promo-code.model';

@Component({
  selector: 'app-promo-code-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>{{ isEditMode ? 'Edit' : 'Create' }} Promo Code</h2>

      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="code">Code *</label>
          <input
            type="text"
            id="code"
            name="code"
            [(ngModel)]="promoCode.code"
            required
          />
        </div>

        <div class="form-group">
          <label for="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            [(ngModel)]="promoCode.amount"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div class="form-group">
          <label for="discountType">Discount Type *</label>
          <select
            id="discountType"
            name="discountType"
            [(ngModel)]="promoCode.discountType"
            required
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed</option>
          </select>
        </div>

        <div class="form-group">
          <label for="expiryDate">Expiry Date *</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            [(ngModel)]="promoCode.expiryDate"
            required
          />
        </div>

        <div class="form-group">
          <label for="usageLimit">Usage Limit (Optional)</label>
          <input
            type="number"
            id="usageLimit"
            name="usageLimit"
            [(ngModel)]="promoCode.usageLimit"
            min="0"
          />
        </div>

        <div class="form-group">
          <label for="status">Status *</label>
          <select
            id="status"
            name="status"
            [(ngModel)]="promoCode.status"
            required
          >
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </div>

        <div style="display: flex; gap: 10px;">
          <button type="submit" class="btn btn-success">Save</button>
          <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class PromoCodeFormComponent implements OnInit {
  promoCode: PromoCode = {
    code: '',
    amount: 0,
    discountType: 'PERCENTAGE',
    expiryDate: '',
    status: 'ACTIVE'
  };
  isEditMode = false;
  promoCodeId?: number;

  constructor(
    private promoCodeService: PromoCodeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.promoCodeId = +id;
      this.loadPromoCode(this.promoCodeId);
    }
  }

  loadPromoCode(id: number) {
    this.promoCodeService.getPromoCodeById(id).subscribe({
      next: (data) => {
        this.promoCode = data;
      },
      error: (error) => {
        console.error('Error loading promo code:', error);
      }
    });
  }

  onSubmit() {
    console.log('onSubmit called!', this.promoCode);
    if (this.isEditMode && this.promoCodeId) {
      console.log('Update mode');
      this.promoCodeService.updatePromoCode(this.promoCodeId, this.promoCode).subscribe({
        next: () => {
          console.log('Update successful');
          this.router.navigate(['/promo-codes']);
        },
        error: (error) => {
          console.error('Error updating promo code:', error);
        }
      });
    } else {
      console.log('Create mode - calling service');
      this.promoCodeService.createPromoCode(this.promoCode).subscribe({
        next: () => {
          console.log('Create successful');
          this.router.navigate(['/promo-codes']);
        },
        error: (error) => {
          console.error('Error creating promo code:', error);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/promo-codes']);
  }
}
