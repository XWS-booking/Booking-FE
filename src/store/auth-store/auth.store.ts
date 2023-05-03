import { produce } from 'immer';
import { StateCreator } from "zustand"
import { User } from "./model/user.model"
import { Login } from "./types/login.type"
import { Registration } from "./types/registration.type"
import { DEFAULT_HEADERS } from "../../utils/auth.constants"

export type AuthStoreState = {
    token: string | null,
    user: User | null
}
export type AuthActions = {
    login: (data: Login) => Promise<boolean>,
    logout: () => void,
}

export const state: AuthStoreState = {
    token: null,
    user: null,
}


export type AuthStore = AuthStoreState & AuthActions

export const authStoreSlice: StateCreator<AuthStore> = (set) => ({
    ...state,
    login: async ({ email, password }: Login) => {
        const rawResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/signin`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: DEFAULT_HEADERS
        }).then(res => {
            if(res.status >= 400) {
                return null
            }
            return res.json();
        });
        const token = await rawResponse;
        if(token == null) return false
        set(
            produce((state: AuthStore) => {
                state.token = token['accessToken']
                state.user = null
                return state
            })
        )
        return true;
    },
    logout: () => {
        set(
            produce((state: AuthStore) => {
                state.token = null
                state.user = null
                return state
            })
        )
    },
})

