export type AccommodationRatingRequest = {
    accommodationId: string
    guestId?: string
    rating: number
    reservationId: string
}