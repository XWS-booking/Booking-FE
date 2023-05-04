import { User } from "../../auth-store/model/user.model";

export type Accommodation = {
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
  pictureUrls: string[];
  owner: User;
};
