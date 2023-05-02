export type CreateAccommodation = {
  id: string;
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
  minGuests: number;
  maxGuests: number;
  pictures: FileList;
  ownerId: string;
};
