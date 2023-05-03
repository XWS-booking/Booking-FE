export type Reservation = {
    Id?: string
    accommodationId: string
    buyerId: string
    startDate: Date
    endDate: Date
    guests: number
    status?: number
}