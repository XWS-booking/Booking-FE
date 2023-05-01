import { AuthStore, authStoreSlice } from './auth-store/auth.store';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { AccommodationStore, accommodationStoreSlice } from './accommodation-store/accommodation.store';

export type AppStore = AuthStore & AccommodationStore
export const useApplicationStore = create<AppStore>()(
    persist(
        immer((...a) => ({
            ...authStoreSlice(...a),
            ...accommodationStoreSlice(...a)
        })),
        {
            partialize: ({ token, user }) => ({
                token,
                user,
            }),
            name: 'application-store',
        }
    )
)