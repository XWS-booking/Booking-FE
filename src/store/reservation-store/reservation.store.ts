import axios from "axios"
import { create, StateCreator } from "zustand"
import produce from "immer"
import { AppStore} from "../application.store"
import { Reservation } from "./types/reservation.type"

export type ReservationStoreState = {
    bookAccommodationRes: any
    isAvailableRes: boolean
}
export type ReservationActions = {
    bookAccommodation: (reservation: Reservation) => Promise<void>
    isAccommodationAvailable: (id: string, startDate: Date, endDate: Date) => Promise<void>
}

export const state: ReservationStoreState = {
    bookAccommodationRes : null,
    isAvailableRes: false
}

export type ReservationStore = ReservationStoreState & ReservationActions

export const reservationStoreSlice: StateCreator<AppStore, [], [], ReservationStore> = (set, get) => ({
    ...state,
    bookAccommodation: async (reservation: Reservation) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/reservation`, reservation)
            set(
                produce((state: ReservationStore) => {
                    state.bookAccommodationRes = res.data
                    return state
                })
            )
        } catch (e) {
            console.log(e)
        }
    },
    isAccommodationAvailable: async (id: string, startDate: Date, endDate: Date) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/reservation/isAccommodationAvailable/${id}/${startDate.toISOString()}/${endDate.toISOString()}`)
            set(
                produce((state: ReservationStore) => {
                    state.isAvailableRes = res.data.available
                    return state
                })
            )
        } catch (e) {
            console.log(e)
        }
    },
})