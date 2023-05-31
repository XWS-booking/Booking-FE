import { User } from "../../auth-store/model/user.model"

export type AccommodationRating = {
    id: string,
    accommodationId: string,
    guest: User
    rating: number
    time: Date
}
