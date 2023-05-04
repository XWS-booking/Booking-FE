import { AuthStore, authStoreSlice } from './auth-store/auth.store';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { AccommodationStore, accommodationStoreSlice } from './accommodation-store/accommodation.store';
import { ReservationStore, reservationStoreSlice } from './reservation-store/reservation.store';

export type AppStore = AuthStore & AccommodationStore & ReservationStore
export const useApplicationStore = create<AppStore>()(
    persist(
        immer((...a) => ({
            ...authStoreSlice(...a),
            ...accommodationStoreSlice(...a),
            ...reservationStoreSlice(...a)
        })),
        {
            partialize: ({ loginStateRes, user }) => ({
                loginStateRes: {
                    data: loginStateRes.data,
                    status: "IDLE",
                    error: null
                },
                user,
            }),
            name: 'application-store',
        }
    )
)
