import axios from "axios"
import { create, StateCreator } from "zustand"
import produce from "immer"
import { AppStore} from "../application.store"
import { Accommodation } from "./types/accommodation.type"

export type AccommodationStoreState = {
    accommodations: Accommodation[]
}
export type AccommodationActions = {
    getAccommodations: (city: string, guests: number, startDate: Date, endDate: Date) => Promise<void>
}

export const state: AccommodationStoreState = {
    accommodations: []
}

export type AccommodationStore = AccommodationStoreState & AccommodationActions

export const accommodationStoreSlice: StateCreator<AppStore, [], [], AccommodationStore> = (set, get) => ({
    ...state,
    getAccommodations: async (city: string, guests: number, startDate: Date, endDate: Date) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/searchAccommodation/${city}/${guests}/${startDate}/${endDate}`)
          
            set(
                produce((state: AccommodationStore) => {
                    console.log(res.data)
                    state.accommodations = res.data
                    return state
                })
            )
        } catch (e) {
            console.log(e)
        }
    },
})