import axios from "axios"
import { create, StateCreator } from "zustand"
import produce from "immer"
import { AppStore} from "../application.store"
import { Accommodation } from "./types/accommodation.type"
import { AccommodationPage } from "./types/accommodation.page"

export type AccommodationStoreState = {
    accommodationPage: AccommodationPage
    spinner: boolean
}
export type AccommodationActions = {
    getAccommodations: (city: string, guests: number, startDate: Date, endDate: Date, pageSize: number, pageNumber: number) => Promise<void>
}

export const state: AccommodationStoreState = {
    accommodationPage: {Data: [], TotalCount: 0},
    spinner: false
}

export type AccommodationStore = AccommodationStoreState & AccommodationActions

export const accommodationStoreSlice: StateCreator<AppStore, [], [], AccommodationStore> = (set, get) => ({
    ...state,
    getAccommodations: async (city: string, guests: number, startDate: Date, endDate: Date, pageSize: number, pageNumber: number) => {
        try {
            set(
                produce((state: AccommodationStore) => {
                    state.spinner = true
                    state.accommodationPage = {TotalCount: 0, Data: []}
                    return state
                })
            )

            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/searchAccommodation/${city}/${guests}/${startDate.toISOString()}/${endDate.toISOString()}/${pageSize}/${pageNumber}`)
          
            set(
                produce((state: AccommodationStore) => {
                    console.log(res.data)
                    state.spinner = false
                    state.accommodationPage = res.data
                    return state
                })
            )
        } catch (e) {
            console.log(e)
        }
    },
})