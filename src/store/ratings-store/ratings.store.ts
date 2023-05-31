import axios from 'axios';
import { StateCreator } from 'zustand';
import produce from 'immer';
import { AppStore } from '../application.store';
import { ResponseState } from '../response-state.type';
import { toast } from 'react-toastify';
import { AccommodationRating } from './types/accommodationRating';
import { AccommodationRatingRequest } from './types/accommodationRatingRequest';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export type RatingsStoreState = {
  accommodationRatingsRes: ResponseState<AccommodationRating[]>;
  rateAccommodationRes: ResponseState<any>;
};
export type RatingsActions = {
  getAccommodationRatings: (id: string) => Promise<void>;
  rateAccommodation: (rating: AccommodationRatingRequest) => Promise<void>
};

export const state: RatingsStoreState = {
  accommodationRatingsRes: {
    data: [],
    status: 'IDLE',
    error: null,
  },
  rateAccommodationRes : {
    data: null,
    status: 'IDLE',
    error: null
  }
};

export type RatingsStore = RatingsStoreState & RatingsActions;

export const ratingsStoreSlice: StateCreator<
  AppStore,
  [],
  [],
  RatingsStore
> = (set, get) => ({
  ...state,
  getAccommodationRatings: async (id: string) => {
    set(
      produce((state: RatingsStore) => {
        state.accommodationRatingsRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.get(`${BASE_URL}/api/rating/accommodation/${id}`, {
        headers: {
          Authorization: 'Bearer ' + get().loginStateRes.data,
        },
      });
      set(
        produce((state: RatingsStore) => {
          state.accommodationRatingsRes.status = 'SUCCESS';
          state.accommodationRatingsRes.data = res.data;
          return state;
        })
      );
    } catch (e: any) {
      set(
        produce((state: RatingsStore) => {
          state.accommodationRatingsRes.status = 'ERROR';
          state.accommodationRatingsRes.data = [];
          state.accommodationRatingsRes.error = e.response.data.message;
          return state;
        })
      );
    }
  },
  rateAccommodation: async (rating: AccommodationRatingRequest) => {
    set(
      produce((state: RatingsStore) => {
        state.rateAccommodationRes.status = 'LOADING';
        return state;
      })
    );
    try {
        console.log(rating)
      const res = await axios.post(`${BASE_URL}/api/rating/accommodation`, rating, {
        headers: {
          Authorization: 'Bearer ' + get().loginStateRes.data,
        },
      });
      set(
        produce((state: RatingsStore) => {
          state.rateAccommodationRes.status = 'SUCCESS';
          state.rateAccommodationRes.data = res.data;
          return state;
        })
      );
      toast.success('Successfully rated accommodation!');
    } catch (e: any) {
      set(
        produce((state: RatingsStore) => {
          state.rateAccommodationRes.status = 'ERROR';
          state.rateAccommodationRes.data = null;
          state.rateAccommodationRes.error = e.response.data.message;
          return state;
        })
      );
      toast.error(e.response.data.message);
    }
  },
 
});
