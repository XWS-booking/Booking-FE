export type Pricing = {
  uuid?: string;
  pricingType: 0 | 1;
  price: number;
  from: Date;
  to: Date;
};
