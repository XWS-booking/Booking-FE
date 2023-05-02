import axios from "axios";
import { create, StateCreator } from "zustand";
import produce from "immer";
import { AppStore } from "../application.store";
import { Accommodation } from "./types/accommodation.type";

export type AccommodationStoreState = {
  accommodations: Accommodation[];
  createAccommodationRes: any;
};
export type AccommodationActions = {
  getAccommodations: (
    city: string,
    guests: number,
    startDate: Date,
    endDate: Date
  ) => Promise<void>;
  createAccommodation: (accommodation: Accommodation) => Promise<void>;
};

export const state: AccommodationStoreState = {
  accommodations: [],
  createAccommodationRes: null,
};

export type AccommodationStore = AccommodationStoreState & AccommodationActions;

export const accommodationStoreSlice: StateCreator<
  AppStore,
  [],
  [],
  AccommodationStore
> = (set, get) => ({
  ...state,
  getAccommodations: async (
    city: string,
    guests: number,
    startDate: Date,
    endDate: Date
  ) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/searchAccommodation/${city}/${guests}/${startDate}/${endDate}`
      );

      set(
        produce((state: AccommodationStore) => {
          console.log(res.data);
          state.accommodations = res.data;
          return state;
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  createAccommodation: async (accommodation: Accommodation) => {
    try {
      const formData = new FormData();
      formData.append("name", accommodation.name);
      formData.append("street", accommodation.street);
      formData.append("streetNumber", accommodation.streetNumber);
      formData.append("city", accommodation.city);
      formData.append("zipCode", accommodation.zipCode);
      formData.append("country", accommodation.country);
      formData.append("wifi", accommodation.wifi.toString());
      formData.append("kitchen", accommodation.kitchen.toString());
      formData.append(
        "airConditioner",
        accommodation.airConditioner.toString()
      );
      formData.append("freeParking", accommodation.freeParking.toString());
      formData.append("minGuests", accommodation.minGuests.toString());
      formData.append("maxGuests", accommodation.maxGuests.toString());
      Array.from(accommodation.pictures).forEach((picture) => {
        formData.append("attachment", picture);
      });
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/accomodation/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            //fix when login implemented
            Authorization:
              "Bearer " +
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODMwNjk4MDksImlkIjoiNjQ1MTQ1NjgwMDUyM2JkNmViOWE5ZWU2Iiwicm9sZSI6MH0.oN103XAOnnompL4-78aJDXu6Q5imKVaCIycG8brCwbc",
          },
        }
      );
      set(
        produce((state: AccommodationStore) => {
          state.createAccommodationRes = res.data;
          return state;
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
});
