import axios from "axios"
import {create, StateCreator} from "zustand"
import produce from "immer"
import {AppStore} from "../application.store"
import {ReservationRequest} from "./types/reservation-request.type"
import {AccomodationAvailableParams} from "./types/accomodation-available.type";
import {ResponseState} from "../response-state.type";
import { Reservation } from "./types/reservation.type"

const BASE_URL = process.env.REACT_APP_BASE_URL

export type ReservationStoreState = {
    bookAccommodationRes: ResponseState<any>
    isAvailableRes: ResponseState<boolean | null>
    guestsReservationsRes: ResponseState<Reservation[]>
    deleteReservationRes: ResponseState<any>
}
export type ReservationActions = {
    bookAccommodation: (reservation: ReservationRequest) => Promise<void>
    isAccommodationAvailable: (params: AccomodationAvailableParams) => Promise<void>
    getGuestsReservations: () => Promise<void>
    deleteReservation: (id: string) => Promise<void>
    
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
    deleteReservationRes: {
        data: null,
        status: "IDLE",
        error: null
    }
}

export type ReservationStore = ReservationStoreState & ReservationActions

export const reservationStoreSlice: StateCreator<AppStore, [], [], ReservationStore> = (set, get) => ({
    ...state,
    bookAccommodation: async (reservation: ReservationRequest) => {
        set(
            produce((state: ReservationStore) => {
                state.bookAccommodationRes.status = "LOADING"
                return state
            })
        )
        try {
            const res = await axios.post(`${BASE_URL}/api/reservation`, reservation,
                {
                    headers: {
                        "Authorization": "Bearer " + get().loginStateRes.data
                    }
                }
            )
            set(
                produce((state: ReservationStore) => {
                    state.bookAccommodationRes.status = "SUCCESS"
                    state.bookAccommodationRes.data = res.data
                    return state
                })
            )
        } catch (e) {
            set(
                produce((state: ReservationStore) => {
                    state.bookAccommodationRes.status = "ERROR"
                    return state
                })
            )
        }
    },
    isAccommodationAvailable: async ({id, startDate, endDate}: AccomodationAvailableParams) => {
        set(
            produce((state: ReservationStore) => {
                state.isAvailableRes.status = "LOADING"
                return state
            })
        )
        try {
            const res = await axios.get(`${BASE_URL}/api/reservation/isAccommodationAvailable/${id}/${startDate}/${endDate}`,
                {
                    headers: {
                        "Authorization": "Bearer " + get().loginStateRes.data
                    }
                }
            )
            set(
                produce((state: ReservationStore) => {
                    state.isAvailableRes.status = "SUCCESS"
                    state.isAvailableRes.data = res.data.available
                    return state
                })
            )
        } catch (e) {
            set(
                produce((state: ReservationStore) => {
                    state.isAvailableRes.status = "ERROR"
                    return state
                })
            )
        }
    },
    getGuestsReservations: async () => {
        set(
            produce((state: ReservationStore) => {
                state.guestsReservationsRes.status = "LOADING"
                return state
            })
        )
        try {
            const res = await axios.get(`${BASE_URL}/api/reservations/buyer`, 
                {
                    headers: {
                        "Authorization": "Bearer " + get().loginStateRes.data
                    }
                }
            )
            set(
                produce((state: ReservationStore) => {
                    state.guestsReservationsRes.status = "SUCCESS"
                    state.guestsReservationsRes.data = res.data
                    return state
                })
            )
        } catch (e) {
            set(
                produce((state: ReservationStore) => {
                    state.guestsReservationsRes.status = "ERROR"
                    return state
                })
            )
        }
    },
    deleteReservation: async (id: string) => {
        set(
            produce((state: ReservationStore) => {
                state.deleteReservationRes.status = "LOADING"
                return state
            })
        )
        try {
            const res = await axios.delete(`${BASE_URL}/api/reservation/${id}`, 
                {
                    headers: {
                        "Authorization": "Bearer " + get().loginStateRes.data
                    }
                }
            )
            set(
                produce((state: ReservationStore) => {
                    state.deleteReservationRes.status = "SUCCESS"
                    state.deleteReservationRes.data = res.data
                    return state
                })
            )
        } catch (e) {
            set(
                produce((state: ReservationStore) => {
                    state.deleteReservationRes.status = "ERROR"
                    return state
                })
            )
        }
    },
})
