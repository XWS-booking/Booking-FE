export type UpdateAccommodationRatingRequest = {
    id?: string,
    rating: number
    accommodationId: string
    oldRating?: number
}