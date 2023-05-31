import { Accommodation } from "../../accommodation-store/types/accommodation.type"
import { AccommodationRating } from "../../ratings-store/types/accommodationRating"

export type Reservation = {
    id: string
    accommodation: Accommodation
    buyerId?: string
    startDate: Date
    endDate: Date
    guests: number
    status?: number
    accommodationRating?: AccommodationRating
}