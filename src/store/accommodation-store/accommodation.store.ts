import axios from 'axios';
import { StateCreator } from 'zustand';
import produce from 'immer';
import { AppStore } from '../application.store';
import { AccomodationsPaginated } from './types/accommodations.type';
import { CreateAccommodation } from './types/createAccommodation.type';
import { AccomodationsFilter } from './types/accomodations-filter.type';
import { ResponseState } from '../response-state.type';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export type AccommodationStoreState = {
  accommodationPageRes: ResponseState<AccomodationsPaginated>;
  createAccommodationRes: ResponseState<void | null>;
};
export type AccommodationActions = {
  getAccommodations: (data: AccomodationsFilter) => Promise<void>;
  createAccommodation: (accommodation: CreateAccommodation) => Promise<void>;
};

export const state: AccommodationStoreState = {
  accommodationPageRes: {
    error: null,
    status: 'IDLE',
    data: { data: [], totalCount: 0 },
  },
  createAccommodationRes: {
    error: null,
    status: 'IDLE',
    data: null,
  },
};

export type AccommodationStore = AccommodationStoreState & AccommodationActions;

const createFormDataFromAccommodation = (
  accommodation: CreateAccommodation
) => {
  const formData = new FormData();
  formData.append('name', accommodation.name);
  formData.append('street', accommodation.street);
  formData.append('streetNumber', accommodation.streetNumber);
  formData.append('city', accommodation.city);
  formData.append('zipCode', accommodation.zipCode);
  formData.append('country', accommodation.country);
  formData.append('wifi', accommodation.wifi.toString());
  formData.append('kitchen', accommodation.kitchen.toString());
  formData.append('airConditioner', accommodation.airConditioner.toString());
  formData.append('autoReservation', accommodation.autoReservation.toString());
  formData.append('freeParking', accommodation.freeParking.toString());
  formData.append('minGuests', accommodation.minGuests.toString());
  formData.append('maxGuests', accommodation.maxGuests.toString());
  formData.append('pricing', JSON.stringify(accommodation.pricing));
  Array.from(accommodation.pictures).forEach((picture) => {
    formData.append('attachment', picture);
  });
  return formData;
};

export const accommodationStoreSlice: StateCreator<
  AppStore,
  [],
  [],
  AccommodationStore
> = (set, get) => ({
  ...state,
  getAccommodations: async ({
    city,
    guests,
    startDate,
    endDate,
    pageSize,
    pageNumber,
  }: AccomodationsFilter) => {
    //Set status to loading
    set(
      produce((state: AccommodationStore) => {
        state.accommodationPageRes.status = 'LOADING';
        return state;
      })
    );
    //Call api url
    try {
      const url = `${BASE_URL}/api/accommodations/search/${city}/${guests}/${startDate}/${endDate}/${pageSize}/${pageNumber}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${get().loginStateRes.data}`,
        },
      });
      //Set status to success
      set(
        produce((state: AccommodationStoreState) => {
          state.accommodationPageRes.status = 'SUCCESS';
          state.accommodationPageRes.data = res.data;
          return state;
        })
      );
    } catch (e) {
      //Set status to error
      set(
        produce((state: AccommodationStoreState) => {
          state.accommodationPageRes.status = 'ERROR';
          state.accommodationPageRes.data = { data: [], totalCount: 0 };
          return state;
        })
      );
    }
  },
  createAccommodation: async (accommodation: CreateAccommodation) => {
    set(
      produce((state: AccommodationStoreState) => {
        state.createAccommodationRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const body = createFormDataFromAccommodation(accommodation);
      const res = await axios.post(
        `${BASE_URL}/api/accomodation/create`,
        body,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${get().loginStateRes.data}`,
          },
        }
      );
      set(
        produce((state: AccommodationStoreState) => {
          state.createAccommodationRes.status = 'SUCCESS';
          state.createAccommodationRes.data = res.data;
          return state;
        })
      );
    } catch (e) {
      set(
        produce((state: AccommodationStoreState) => {
          state.createAccommodationRes.status = 'ERROR';
          return state;
        })
      );
    }
  },
});
