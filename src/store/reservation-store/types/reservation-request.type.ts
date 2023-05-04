export type ReservationRequest = {
    id?: string
    accommodationId: string
    buyerId?: string
    startDate: Date
    endDate: Date
    guests: number
    status?: number
}