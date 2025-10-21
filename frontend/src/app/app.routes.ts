import { Routes } from '@angular/router';
import { PromoCodeListComponent } from './components/promo-code-list/promo-code-list.component';
import { PromoCodeFormComponent } from './components/promo-code-form/promo-code-form.component';
import { PromoCodeReportComponent } from './components/promo-code-report/promo-code-report.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/promo-codes', pathMatch: 'full' },
  {
    path: 'promo-codes',
    component: PromoCodeListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'promo-codes/new',
    component: PromoCodeFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'promo-codes/edit/:id',
    component: PromoCodeFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'report',
    component: PromoCodeReportComponent,
    canActivate: [AuthGuard]
  }
];
