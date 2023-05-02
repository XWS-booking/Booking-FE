import axios from "axios"
import { create, StateCreator } from "zustand"
import produce from "immer"
import { AppStore} from "../application.store"
import { Reservation } from "./types/reservation.type"

export type ReservationStoreState = {
    bookAccommodationRes: any
}
export type ReservationActions = {
    bookAccommodation: (reservation: Reservation) => Promise<void>
}

export const state: ReservationStoreState = {
    bookAccommodationRes : null
}

export type ReservationStore = ReservationStoreState & ReservationActions

export const reservationStoreSlice: StateCreator<AppStore, [], [], ReservationStore> = (set, get) => ({
    ...state,
    bookAccommodation: async (reservation: Reservation) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/reservation`, reservation)
            set(
                produce((state: ReservationStore) => {
                    console.log(res.data)
                    state.bookAccommodationRes = res.data
                    return state
                })
            )
        } catch (e) {
            console.log(e)
        }
    },
})