export type Accommodation = {
  Id: string;
  Name: string;
  Street: string;
  StreetNumber: string;
  City: string;
  Zipcode: string;
  Country: string;
  Wifi: boolean;
  Kitchen: boolean;
  AirConditioner: boolean;
  FreeParking: boolean;
  MinGuests: number;
  MaxGuests: number;
  PictureUrls: string[];
  OwnerId: string;
};
