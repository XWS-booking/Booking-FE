import { User } from "../../auth-store/model/user.model"

export type NotificationType = {
    userId?: string,
    guestCreatedReservationRequest?: boolean
    guestCanceledReservation?: boolean
    guestRatedHost?: boolean
    guestRatedAccommodation?: boolean
    distinguishedHost?: boolean
    hostConfirmedOrRejectedReservation?: boolean
}
