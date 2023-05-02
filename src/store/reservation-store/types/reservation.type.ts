export type Reservation = {
    Id?: string
    AccommodationId: string
    BuyerId: string
    StartDate: Date
    EndDate: Date
    Guests: number
    Status?: number
}