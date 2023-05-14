import axios from 'axios';
import { StateCreator } from 'zustand';
import produce from 'immer';
import { AppStore } from '../application.store';
import { ReservationRequest } from './types/reservation-request.type';
import { AccomodationAvailableParams } from './types/accomodation-available.type';
import { ResponseState } from '../response-state.type';
import { Reservation } from './types/reservation.type';
import { ReservationWithCancellations } from './types/reservation-with-cancellation.type';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export type ReservationStoreState = {
    bookAccommodationRes: ResponseState<any>
    isAvailableRes: ResponseState<boolean | null>
    guestsReservationsRes: ResponseState<Reservation[]>
    ownersReservationsRes: ResponseState<ReservationWithCancellations[]>
    deleteReservationRes: ResponseState<null>
    confirmReservationRes: ResponseState<null>
    rejectReservationRes: ResponseState<null>
    cancelReservationRes: ResponseState<any>
    accommodationsReservationsRes: ResponseState<Reservation[]>
}
export type ReservationActions = {
    bookAccommodation: (reservation: ReservationRequest) => Promise<void>
    isAccommodationAvailable: (params: AccomodationAvailableParams) => Promise<void>
    getGuestsReservations: () => Promise<void>
    getOwnersReservations: () => Promise<void>
    deleteReservation: (id: string) => Promise<void>
    confirmReservation: (id: string) => Promise<void>
    rejectReservation: (id: string) => Promise<void>
    cancelReservation: (id: string) => Promise<void>;
    getAccommodationsReservations: (id: string) => Promise<void>
}

export const state: ReservationStoreState = {
    bookAccommodationRes: {
        data: null,
        status: "IDLE",
        error: null
    },
    isAvailableRes: {
        data: null,
        status: "IDLE",
        error: null
    },
    guestsReservationsRes: {
        data: [],
        status: "IDLE",
        error: null
    },
    ownersReservationsRes: {
        data: [],
        status: "IDLE",
        error: null
    },
    deleteReservationRes: {
        data: null,
        status: "IDLE",
        error: null
    },
    confirmReservationRes: {
        data: null,
        status: "IDLE",
        error: null
    },
    rejectReservationRes: {
        data: null,
        status: "IDLE",
        error: null
    },
    cancelReservationRes: {
        data: null,
        status: "IDLE",
        error: null,
    },
    accommodationsReservationsRes: {
        data: [],
        status: "IDLE",
        error: null,
    },
}

export type ReservationStore = ReservationStoreState & ReservationActions;

export const reservationStoreSlice: StateCreator<
  AppStore,
  [],
  [],
  ReservationStore
> = (set, get) => ({
  ...state,
  bookAccommodation: async (reservation: ReservationRequest) => {
    set(
      produce((state: ReservationStore) => {
        state.bookAccommodationRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.post(`${BASE_URL}/api/reservation`, reservation, {
        headers: {
          Authorization: 'Bearer ' + get().loginStateRes.data,
        },
      });
      set(
        produce((state: ReservationStore) => {
          state.bookAccommodationRes.status = 'SUCCESS';
          state.bookAccommodationRes.data = res.data;
          return state;
        })
      );
      toast.success('Successfully booked accommodation!');
    } catch (e: any) {
      console.log(e);
      toast.error(e.response.data.message);
      set(
        produce((state: ReservationStore) => {
          state.bookAccommodationRes.status = 'ERROR';
          state.bookAccommodationRes.data = null;
          state.bookAccommodationRes.error = e.response.data.message;
          return state;
        })
      );
    }
  },
  isAccommodationAvailable: async ({
    id,
    startDate,
    endDate,
  }: AccomodationAvailableParams) => {
    set(
      produce((state: ReservationStore) => {
        state.isAvailableRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.get(
        `${BASE_URL}/api/reservation/isAccommodationAvailable/${id}/${startDate}/${endDate}`,
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
      set(
        produce((state: ReservationStore) => {
          state.isAvailableRes.status = 'SUCCESS';
          state.isAvailableRes.data = res.data.available;
          return state;
        })
      );
    } catch (e) {
      set(
        produce((state: ReservationStore) => {
          state.isAvailableRes.status = 'ERROR';
          return state;
        })
      );
    }
  },
  cancelReservation: async (id: string) => {
    set(
      produce((state: ReservationStore) => {
        state.cancelReservationRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.post(
        `${BASE_URL}/api/reservation/cancel`,
        {
          token: get().loginStateRes.data,
          reservationId: id,
        },
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
      set(
        produce((state: ReservationStore) => {
          state.cancelReservationRes.status = 'SUCCESS';
          state.cancelReservationRes.data = res.data;
          return state;
        })
      );
      toast.success('Reservation successfully canceled!');
    } catch (e: any) {
      console.log(e);
      toast.error(e.response.data.message);
      set(
        produce((state: ReservationStore) => {
          state.cancelReservationRes.status = 'ERROR';
          state.cancelReservationRes.error = e.response.data.message;
          return state;
        })
      );
    }
  },
  getGuestsReservations: async () => {
    set(
      produce((state: ReservationStore) => {
        state.guestsReservationsRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.get(`${BASE_URL}/api/reservations/buyer`, {
        headers: {
          Authorization: 'Bearer ' + get().loginStateRes.data,
        },
      });
      set(
        produce((state: ReservationStore) => {
          state.guestsReservationsRes.status = 'SUCCESS';
          state.guestsReservationsRes.data = res.data;
          return state;
        })
      );
    } catch (e) {
      set(
        produce((state: ReservationStore) => {
          state.guestsReservationsRes.status = 'ERROR';
          return state;
        })
      );
    }
  },
  getOwnersReservations: async () => {
    set(
      produce((state: ReservationStore) => {
        state.ownersReservationsRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.get(`${BASE_URL}/api/reservations/owner`, {
        headers: {
          Authorization: 'Bearer ' + get().loginStateRes.data,
        },
      });
      set(
        produce((state: ReservationStore) => {
          state.ownersReservationsRes.status = 'SUCCESS';
          state.ownersReservationsRes.data = res.data;
          return state;
        })
      );
    } catch (e) {
      set(
        produce((state: ReservationStore) => {
          state.ownersReservationsRes.status = 'ERROR';
          return state;
        })
      );
    }
  },
  deleteReservation: async (id: string) => {
    set(
      produce((state: ReservationStore) => {
        state.deleteReservationRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.delete(`${BASE_URL}/api/reservation/${id}`, {
        headers: {
          Authorization: 'Bearer ' + get().loginStateRes.data,
        },
      });
      set(
        produce((state: ReservationStore) => {
          state.deleteReservationRes.status = 'SUCCESS';
          state.deleteReservationRes.data = res.data;
          return state;
        })
      );
    } catch (e) {
      set(
        produce((state: ReservationStore) => {
          state.deleteReservationRes.status = 'ERROR';
          return state;
        })
      );
    }
  },
  rejectReservation: async (id: string) => {
    set(
      produce((state: ReservationStore) => {
        state.rejectReservationRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/reservation/reject/${id}`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
      set(
        produce((state: ReservationStore) => {
          state.rejectReservationRes.status = 'SUCCESS';
          state.rejectReservationRes.data = res.data;
          return state;
        })
      );
    } catch (e) {
      console.log(e);
      set(
        produce((state: ReservationStore) => {
          state.rejectReservationRes.status = 'ERROR';
          return state;
        })
      );
    }
  },
  confirmReservation: async (id: string) => {
    set(
      produce((state: ReservationStore) => {
        state.confirmReservationRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/reservation/confirm/${id}`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
      set(
        produce((state: ReservationStore) => {
          state.confirmReservationRes.status = 'SUCCESS';
          state.confirmReservationRes.data = res.data;
          return state;
        })
      );
    } catch (e) {
      console.log(e);
      set(
        produce((state: ReservationStore) => {
          state.confirmReservationRes.status = 'ERROR';
          return state;
        })
      );
    }
  },
  getAccommodationsReservations: async (id: string) => {
      set(
          produce((state: ReservationStore) => {
              state.accommodationsReservationsRes.status = "LOADING"
              return state
          })
      )
      try {
          const res = await axios.get(`${BASE_URL}/api/reservations/accommodation/${id}`, 
              {
                  headers: {
                      "Authorization": "Bearer " + get().loginStateRes.data
                  }
              }
          )
          set(
              produce((state: ReservationStore) => {
                  state.accommodationsReservationsRes.status = "SUCCESS"
                  state.accommodationsReservationsRes.data = res.data
                  console.log(state.accommodationsReservationsRes.data)
                  return state
              })
          )
      } catch (e) {
          set(
              produce((state: ReservationStore) => {
                  console.log("error")
                  state.accommodationsReservationsRes.status = "ERROR"
                  return state
              })
          )
      }
  }
});
