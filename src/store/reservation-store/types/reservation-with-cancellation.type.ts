import { Accommodation } from "../../accommodation-store/types/accommodation.type"

export type ReservationWithCancellations = {
    id: string
    accommodation: Accommodation
    buyerId?: string
    startDate: Date
    endDate: Date
    guests: number
    status?: number
    numberOfCancellation: number
}