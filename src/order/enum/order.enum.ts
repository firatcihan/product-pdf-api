export enum OrderStatusEnum {
  Draft = 'draft',
  Confirmed = 'confirmed',
  InProduction = 'in_production',
  Ready = 'ready',
  Shipped = 'shipped',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum CurrencyEnum {
  EUR = 'EUR',
  USD = 'USD',
  TRY = 'TRY',
  GBP = 'GBP',
}

export enum PaymentStatusEnum {
  Unpaid = 'unpaid',
  PartiallyPaid = 'partially_paid',
  Paid = 'paid',
}
