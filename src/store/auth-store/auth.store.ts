import { produce } from 'immer';
import { StateCreator } from "zustand"
import { User } from "./model/user.model"
import { Login } from "./types/login.type"
import { Registration } from "./types/registration.type"

export type AuthStoreState = {
    token: string | null,
    user: User | null
}
export type AuthActions = {
 
}

export const state: AuthStoreState = {
    token: null,
    user: null,
}


export type AuthStore = AuthStoreState & AuthActions

export const authStoreSlice: StateCreator<AuthStore> = (set) => ({
    ...state,
})

