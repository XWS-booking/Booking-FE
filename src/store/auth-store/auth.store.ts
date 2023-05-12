import { produce } from 'immer';
import axios from 'axios';
import { AppStore } from '../application.store';
import { StateCreator } from 'zustand';
import { User } from './model/user.model';
import { Login } from './types/login.type';
import { ResponseState } from '../response-state.type';
import { Registration } from './types/registration.type';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export type AuthStoreState = {
  user: User | null;
  deleteProfileRes: ResponseState<void[]>;
  loginStateRes: ResponseState<string | null>;
  registrationStateRes: ResponseState<void[]>;
};

export type AuthActions = {
  login: (data: Login) => Promise<void>;
  logout: () => void;
  register: (register: Registration) => void;
  deleteProfile: () => Promise<void>;
  fetchLoggedUser: (token: string) => Promise<void>;
};

export const state: AuthStoreState = {
  user: null,
  deleteProfileRes: {
    data: [],
    status: 'IDLE',
    error: null,
  },
  loginStateRes: {
    data: null,
    status: 'IDLE',
    error: null,
  },
  registrationStateRes: {
    data: [],
    status: 'IDLE',
    error: null,
  },
};

export type AuthStore = AuthStoreState & AuthActions;

export const authStoreSlice: StateCreator<AppStore, [], [], AuthStore> = (
  set,
  get
) => ({
  ...state,
  login: async (body: Login) => {
    //Set status to loading
    set(
      produce((state: AuthStoreState) => {
        state.loginStateRes.status = 'LOADING';
        return state;
      })
    );
    // Call API
    try {
      const resp = await axios.post(`${BASE_URL}/api/auth/signin`, body);
      //Set success state
      set(
        produce((state: AuthStoreState) => {
          state.loginStateRes.status = 'SUCCESS';
          state.loginStateRes.data = resp.data.accessToken;
          return state;
        })
      );
      await get().fetchLoggedUser(resp.data.accessToken);
    } catch (e: any) {
      console.log(e);
      //Set error state
      set(
        produce((state: AuthStoreState) => {
          state.loginStateRes.status = 'ERROR';
          state.loginStateRes.data = null;
          state.loginStateRes.error = e.response.data.message;
          return state;
        })
      );
    }
  },
  logout: () => {
    set(
      produce((state: AuthStore) => {
        state.loginStateRes.status = 'IDLE';
        state.loginStateRes.data = null;
        state.user = null;
        return state;
      })
    );
  },
  deleteProfile: async () => {
    set(
      produce((state: AuthStoreState) => {
        state.deleteProfileRes.status = 'LOADING';
        return state;
      })
    );
    try {
      await axios.delete(`${BASE_URL}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${get().loginStateRes.data}`,
        },
      });
      set(
        produce((state: AuthStoreState) => {
          state.deleteProfileRes.status = 'SUCCESS';
          return state;
        })
      );
    } catch (e: any) {
      set(
        produce((state: AuthStoreState) => {
          state.deleteProfileRes.status = 'ERROR';
          state.deleteProfileRes.error = e.response.data;
          return state;
        })
      );
    }
  },
  register: async (data: Registration) => {
    set(
      produce((state: AuthStoreState) => {
        state.registrationStateRes.status = 'LOADING';
      })
    );

    try {
      await axios.post(`${BASE_URL}/api/auth/register`, data);

      set(
        produce((state: AuthStoreState) => {
          state.registrationStateRes.status = 'SUCCESS';
        })
      );
    } catch (e: any) {
      set(
        produce((state: AuthStoreState) => {
          state.registrationStateRes.status = 'ERROR';
          state.registrationStateRes.error = e.response.data.message;
        })
      );
    }
  },
  fetchLoggedUser: async (token: string) => {
    try {
      const resp = await axios.post(`${BASE_URL}/api/auth/user`, {
        token: `Bearer ${token}`,
      });
      set(
        produce((state) => {
          state.user = resp.data;
          return state;
        })
      );
    } catch (e: any) {
      set(
        produce((state) => {
          state.user = null;
          return state;
        })
      );
    }
  },
});
