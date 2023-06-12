import axios from 'axios';
import { StateCreator } from 'zustand';
import produce from 'immer';
import { AppStore } from '../application.store';
import { ResponseState } from '../response-state.type';
import { toast } from 'react-toastify';
import { AccommodationRating } from './types/accommodationRating';
import { AccommodationRatingRequest } from './types/accommodationRatingRequest';
import { UpdateAccommodationRatingRequest } from './types/updateAccommodationRatingRequest';
import { HostRatings } from './types/hostRatings';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export type RatingsStoreState = {
  accommodationRatingsRes: ResponseState<AccommodationRating[]>;
  rateAccommodationRes: ResponseState<any>;
  updateAccommodationRatingRes: ResponseState<any>;
  deleteAccommodationRatingRes: ResponseState<any>;
  hostRatings: ResponseState<HostRatings | null>;
  deleteHostRatingRes: ResponseState<any>;
  updateHostRatingRes: ResponseState<any>;
  createHostRatingRes: ResponseState<any>;
};
export type RatingsActions = {
  getAccommodationRatings: (id: string) => Promise<void>;
  rateAccommodation: (rating: AccommodationRatingRequest) => Promise<void>;
  updateAccommodationRating: (
    rating: UpdateAccommodationRatingRequest
  ) => Promise<void>;
  deleteAccommodationRating: (
    ratingId: string,
    reservationId: string
  ) => Promise<void>;
  getHostRatings: (hostId: string) => Promise<void>;
  deleteHostRating: (id: string) => Promise<void>;
  updateHostRating: (id: string, rate: string, hostId: string, oldRating: number) => Promise<void>;
  createHostRating: (hostId: string, rate: string) => Promise<void>;
};

export const state: RatingsStoreState = {
  accommodationRatingsRes: {
    data: [],
    status: 'IDLE',
    error: null,
  },
  rateAccommodationRes: {
    data: null,
    status: 'IDLE',
    error: null,
  },
  updateAccommodationRatingRes: {
    data: null,
    status: 'IDLE',
    error: null,
  },
  deleteAccommodationRatingRes: {
    data: null,
    status: 'IDLE',
    error: null,
  },
  hostRatings: {
    data: null,
    status: 'IDLE',
    error: null,
  },
  deleteHostRatingRes: {
    data: null,
    status: 'IDLE',
    error: null,
  },
  updateHostRatingRes: {
    data: null,
    status: 'IDLE',
    error: null,
  },
  createHostRatingRes: {
    data: null,
    status: 'IDLE',
    error: null,
  },
};

export type RatingsStore = RatingsStoreState & RatingsActions;

export const ratingsStoreSlice: StateCreator<AppStore, [], [], RatingsStore> = (
  set,
  get
) => ({
  ...state,
  getAccommodationRatings: async (id: string) => {
    set(
      produce((state: RatingsStore) => {
        state.accommodationRatingsRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.get(
        `${BASE_URL}/api/rating/accommodation/${id}`,
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
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
      const res = await axios.post(
        `${BASE_URL}/api/rating/accommodation`,
        rating,
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
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
  updateAccommodationRating: async (
    rating: UpdateAccommodationRatingRequest
  ) => {
    set(
      produce((state: RatingsStore) => {
        state.updateAccommodationRatingRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/rating/accommodation`,
        rating,
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
      set(
        produce((state: RatingsStore) => {
          state.updateAccommodationRatingRes.status = 'SUCCESS';
          state.updateAccommodationRatingRes.data = res.data;
          return state;
        })
      );
      toast.success('Successfully updated accommodation rating!');
    } catch (e: any) {
      set(
        produce((state: RatingsStore) => {
          state.updateAccommodationRatingRes.status = 'ERROR';
          state.updateAccommodationRatingRes.data = null;
          state.updateAccommodationRatingRes.error = e.response.data.message;
          return state;
        })
      );
      toast.error(e.response.data.message);
    }
  },
  deleteAccommodationRating: async (
    ratingId: string,
    reservationId: string
  ) => {
    set(
      produce((state: RatingsStore) => {
        state.deleteAccommodationRatingRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/rating/accommodation/${ratingId}/${reservationId}`,
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
      set(
        produce((state: RatingsStore) => {
          state.deleteAccommodationRatingRes.status = 'SUCCESS';
          state.deleteAccommodationRatingRes.data = res.data;
          return state;
        })
      );
      toast.success('Successfully deleted accommodation rating!');
    } catch (e: any) {
      set(
        produce((state: RatingsStore) => {
          state.deleteAccommodationRatingRes.status = 'ERROR';
          state.deleteAccommodationRatingRes.data = null;
          state.deleteAccommodationRatingRes.error = e.response.data.message;
          return state;
        })
      );
      toast.error(e.response.data.message);
    }
  },
  getHostRatings: async (hostId: string) => {
    set(
      produce((state: RatingsStore) => {
        state.hostRatings.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.get(`${BASE_URL}/api/rating/${hostId}/host`, {
        headers: {
          Authorization: 'Bearer ' + get().loginStateRes.data,
        },
      });
      set(
        produce((state: RatingsStore) => {
          state.hostRatings.status = 'SUCCESS';
          state.hostRatings.data = res.data;
          return state;
        })
      );
    } catch (e: any) {
      set(
        produce((state: RatingsStore) => {
          state.hostRatings.status = 'ERROR';
          state.hostRatings.data = null;
          state.hostRatings.error = e.response.data.message;
          return state;
        })
      );
    }
  },
  deleteHostRating: async (id: string) => {
    set(
      produce((state: RatingsStore) => {
        state.deleteHostRatingRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.delete(`${BASE_URL}/api/rating/${id}/host`, {
        headers: {
          Authorization: 'Bearer ' + get().loginStateRes.data,
        },
      });
      set(
        produce((state: RatingsStore) => {
          state.deleteHostRatingRes.status = 'SUCCESS';
          state.deleteHostRatingRes.data = res.data;
          return state;
        })
      );
      toast.success('Successfully deleted host rating!');
    } catch (e: any) {
      set(
        produce((state: RatingsStore) => {
          state.deleteHostRatingRes.status = 'ERROR';
          state.deleteHostRatingRes.data = null;
          state.deleteHostRatingRes.error = e.response.data.message;
          return state;
        })
      );
      toast.error(e.response.data.message);
    }
  },
  updateHostRating: async (id: string, rate: string, hostId: string, oldRating: number) => {
    set(
      produce((state: RatingsStore) => {
        state.updateHostRatingRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/rating/host`,
        {
          id: id,
          rating: rate,
          hostId: hostId,
          oldRating: oldRating
        },
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
      set(
        produce((state: RatingsStore) => {
          state.updateHostRatingRes.status = 'SUCCESS';
          state.updateHostRatingRes.data = res.data;
          return state;
        })
      );
      toast.success('Successfully updated host rating!');
    } catch (e: any) {
      set(
        produce((state: RatingsStore) => {
          state.updateHostRatingRes.status = 'ERROR';
          state.updateHostRatingRes.data = null;
          state.updateHostRatingRes.error = e.response.data.message;
          return state;
        })
      );
      toast.error(e.response.data.message);
    }
  },
  createHostRating: async (hostId: string, rate: string) => {
    set(
      produce((state: RatingsStore) => {
        state.createHostRatingRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.post(
        `${BASE_URL}/api/rating/host`,
        {
          hostId: hostId,
          guestId: get().user?.id,
          rating: rate,
        },
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
      set(
        produce((state: RatingsStore) => {
          state.createHostRatingRes.status = 'SUCCESS';
          state.createHostRatingRes.data = res.data;
          return state;
        })
      );
      toast.success('Successfully added host rating!');
    } catch (e: any) {
      set(
        produce((state: RatingsStore) => {
          state.createHostRatingRes.status = 'ERROR';
          state.createHostRatingRes.data = null;
          state.createHostRatingRes.error = e.response.data.message;
          return state;
        })
      );
      toast.error(e.response.data.message);
    }
  },
});
