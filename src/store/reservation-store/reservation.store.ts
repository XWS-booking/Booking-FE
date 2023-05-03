import axios from "axios"
import {create, StateCreator} from "zustand"
import produce from "immer"
import {AppStore} from "../application.store"
import {Reservation} from "./types/reservation.type"
import {AccomodationAvailableParams} from "./types/accomodation-available.type";
import {ResponseState} from "../response-state.type";

const BASE_URL = process.env.REACT_APP_BASE_URL

export type ReservationStoreState = {
    bookAccommodationRes: ResponseState<any>
    isAvailableRes: ResponseState<boolean | null>
}
export type ReservationActions = {
    bookAccommodation: (reservation: Reservation) => Promise<void>
    isAccommodationAvailable: (params: AccomodationAvailableParams) => Promise<void>
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
}

export type ReservationStore = ReservationStoreState & ReservationActions

export const reservationStoreSlice: StateCreator<AppStore, [], [], ReservationStore> = (set, get) => ({
    ...state,
    bookAccommodation: async (reservation: Reservation) => {
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
})
