export interface PromoCode {
  id?: number;
  code: string;
  amount: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  expiryDate: string;
  usageLimit?: number;
  usageCount?: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
}
