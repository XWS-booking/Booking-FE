import { produce } from 'immer';
import axios from 'axios';
import { AppStore } from "../application.store";
import { StateCreator } from "zustand"
import { User } from "./model/user.model"
import { Login } from "./types/login.type"
import { DEFAULT_HEADERS } from "../../utils/auth.constants"


export type AuthStoreState = {
    token: string | null,
    user: User | null,
    deleteProfileRes: any
}
export type AuthActions = {
    login: (data: Login) => Promise<boolean>,
    logout: () => void,
    deleteProfile: () => Promise<any>
}

export const state: AuthStoreState = {
    token: null,
    user: null,
    deleteProfileRes: null
}


export type AuthStore = AuthStoreState & AuthActions

export const authStoreSlice:  StateCreator<AppStore, [], [], AuthStore> = (set, get) => ({
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
        console.log(JSON.stringify({token: token['accessToken']}))
        const resp = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/user`, {
            method: 'POST',
            body: JSON.stringify({token: "Bearer " + token['accessToken']}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token['accessToken']
            }
        });
        const user = await resp.json();
        set(
            produce((state: AuthStore) => {
                state.token = token['accessToken']
                state.user = user
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
    deleteProfile: async () => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/deleteProfile`, 
            {
                headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + get().token
                }}
            )
            set(
                produce((state: AuthStore) => {
                    state.deleteProfileRes = res.data
                    return state
                })
            );
            return res.data
        } catch (e) {
            console.log(e)
        }
    },
})

