import axios from 'axios';
import produce from 'immer';
import { toast } from 'react-toastify';
import { StateCreator } from 'zustand';
import { AppStore } from '../application.store';
import { ResponseState } from '../response-state.type';
import { AccommodationFilters } from './types/accommodation.filters.type';
import { Accommodation } from './types/accommodation.type';
import { AccomodationsPaginated } from './types/accommodations.type';
import { AccommodationSearchFilters } from './types/accomodation-search-filters.type';
import { CreateAccommodation } from './types/createAccommodation.type';
import { GetBookingPrice } from './types/get-booking-price.type';
import { Pricing } from './types/pricing.type';
import { Flight } from './types/flight.type';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const FLIGHT_APP_URL = process.env.REACT_APP_FLIGHT_APP_URL;

export type AccommodationStoreState = {
  accommodationPageRes: ResponseState<AccomodationsPaginated>;
  createAccommodationRes: ResponseState<void | null>;
  editPricingRes: ResponseState<void | null>;
  getDepartureFlightsRes: ResponseState<Flight[] | null>;
  getDestinationFlightsRes: ResponseState<Flight[] | null>;
};
export type AccommodationActions = {
  getAccommodations: (
    data: AccommodationSearchFilters,
    additionalFilters: AccommodationFilters
  ) => Promise<void>;
  createAccommodation: (accommodation: CreateAccommodation) => Promise<void>;
  getAccommodation: (id: string) => Promise<Accommodation>;
  editPricing: (id: string, pricing: Pricing[]) => Promise<void>;
  getBookingPrice: (id: string, data: GetBookingPrice) => Promise<number>;
  getDepartureFlights: (
    departure: string,
    destination: string,
    date: Date
  ) => Promise<void>;
  getDestinationFlights: (
    departure: string,
    destination: string,
    date: Date
  ) => Promise<void>;
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
  editPricingRes: {
    error: null,
    status: 'IDLE',
    data: null,
  },
  getDepartureFlightsRes: {
    error: null,
    status: 'IDLE',
    data: null,
  },
  getDestinationFlightsRes: {
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
  getAccommodations: async (
    {
      city,
      guests,
      startDate,
      endDate,
      pageSize,
      pageNumber,
    }: AccommodationSearchFilters,
    additionalFilters: AccommodationFilters
  ) => {
    //Set status to loading
    set(
      produce((state: AccommodationStore) => {
        state.accommodationPageRes.status = 'LOADING';
        return state;
      })
    );
    //Call api url
    try {
      const url = `${BASE_URL}/api/accommodations/search/${city}/${guests}/${startDate.toISOString()}/${endDate.toISOString()}/${pageSize}/${pageNumber}`;
      const res = await axios.post(url, additionalFilters, {
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
      toast.success('Successfully created accommodation');
    } catch (e: any) {
      toast.error(e.response.data.message);

      set(
        produce((state: AccommodationStoreState) => {
          state.createAccommodationRes.status = 'ERROR';
          state.createAccommodationRes.error = e.response.data;
          return state;
        })
      );
    }
  },
  getAccommodation: async (id: string) => {
    try {
      const resp = await axios.get(`${BASE_URL}/api/accommodation/${id}`);
      console.log(resp.data);
      return resp.data;
    } catch (e: any) {
      console.log(e);
      return null;
    }
  },
  editPricing: async (id: string, pricing: Pricing[]) => {
    set(
      produce((state: AccommodationStoreState) => {
        state.editPricingRes.status = 'LOADING';
        return state;
      })
    );
    try {
      await axios.patch(
        `${BASE_URL}/api/accommodation/${id}`,
        { pricing },
        {
          headers: {
            Authorization: `Bearer ${get().loginStateRes.data}`,
          },
        }
      );
      set(
        produce((state: AccommodationStoreState) => {
          state.editPricingRes.status = 'SUCCESS';
          return state;
        })
      );
      toast.success('Successfully updated pricing');
    } catch (e: any) {
      console.log(e);
      toast.error(e.response.data.message);
      set(
        produce((state: AccommodationStoreState) => {
          state.editPricingRes.status = 'ERROR';
          state.editPricingRes.error = e.response.data.message;
          return state;
        })
      );
    }
  },
  getBookingPrice: async (id: string, data: GetBookingPrice) => {
    try {
      const resp = await axios.post(
        `${BASE_URL}/api/accommodation/${id}/price`,
        data,
        {
          headers: {
            Authorization: `Bearer ${get().loginStateRes.data}`,
          },
        }
      );
      return resp.data.price;
    } catch (e: any) {
      console.log(e);
      return 0;
    }
  },
  getDepartureFlights: async (
    departure: string,
    destination: string,
    date: Date
  ) => {
    set(
      produce((state: AccommodationStoreState) => {
        state.getDepartureFlightsRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.get(
        `${FLIGHT_APP_URL}/flights/reservation?date=${date}&destination=${destination}&departure=${departure}`
      );
      set(
        produce((state: AccommodationStoreState) => {
          state.getDepartureFlightsRes.status = 'SUCCESS';
          state.getDepartureFlightsRes.data = res.data;

          return state;
        })
      );
    } catch (e: any) {
      console.log(e);
      set(
        produce((state: AccommodationStoreState) => {
          state.getDepartureFlightsRes.status = 'ERROR';
          state.getDepartureFlightsRes.error = e.response.data.message;
          return state;
        })
      );
    }
  },
  getDestinationFlights: async (
    departure: string,
    destination: string,
    date: Date
  ) => {
    set(
      produce((state: AccommodationStoreState) => {
        state.getDestinationFlightsRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.get(
        `${FLIGHT_APP_URL}/flights/reservation?date=${date}&destination=${destination}&departure=${departure}`
      );
      set(
        produce((state: AccommodationStoreState) => {
          state.getDestinationFlightsRes.status = 'SUCCESS';
          state.getDestinationFlightsRes.data = res.data;
          return state;
        })
      );
    } catch (e: any) {
      console.log(e);
      set(
        produce((state: AccommodationStoreState) => {
          state.getDestinationFlightsRes.status = 'ERROR';
          state.getDestinationFlightsRes.error = e.response.data.message;
          return state;
        })
      );
    }
  },
});
