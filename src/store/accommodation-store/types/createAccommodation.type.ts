import { Pricing } from './pricing.type';

export type CreateAccommodation = {
  name: string;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  country: string;
  wifi: boolean;
  kitchen: boolean;
  airConditioner: boolean;
  freeParking: boolean;
  autoReservation: boolean;
  minGuests: number;
  maxGuests: number;
  pictures: FileList;
  pricing: Pricing[];
};
