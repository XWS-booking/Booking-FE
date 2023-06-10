import axios from 'axios';
import { StateCreator } from 'zustand';
import produce from 'immer';
import { AppStore } from '../application.store';
import { ResponseState } from '../response-state.type';
import { NotificationType } from './types/notification.type';
;

const BASE_URL = process.env.REACT_APP_BASE_URL;

export type NotificationStoreState = {
  getNotificationPrefRes: ResponseState<NotificationType | null>;
  updateNotificationPrefRes: ResponseState<any>
};
export type NotificationActions = {
  getNotificationPreferences: () => Promise<void>;
  updateNotificationPreferences: (pref: NotificationType) => Promise<void>
};

export const state: NotificationStoreState = {
  getNotificationPrefRes: {
    data: null,
    status: 'IDLE',
    error: null,
  },
  updateNotificationPrefRes: {
    data: null,
    status: 'IDLE',
    error: null,
  }
};

export type NotificationStore = NotificationStoreState & NotificationActions;

export const notificationStoreSlice: StateCreator<AppStore, [], [], NotificationStore> = (
  set,
  get
) => ({
  ...state,
  getNotificationPreferences: async () => {
    set(
      produce((state: NotificationStore) => {
        state.getNotificationPrefRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.get(
        `${BASE_URL}/api/notification/preferences`,
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
      set(
        produce((state: NotificationStore) => {
          state.getNotificationPrefRes.status = 'SUCCESS';
          state.getNotificationPrefRes.data = res.data;
          return state;
        })
      );
    } catch (e: any) {
      set(
        produce((state: NotificationStore) => {
          state.getNotificationPrefRes.status = 'ERROR';
          state.getNotificationPrefRes.data = null;
          state.getNotificationPrefRes.error = e.response.data.message;
          return state;
        })
      );
    }
  },
  updateNotificationPreferences: async (pref: NotificationType) => {
    set(
      produce((state: NotificationStore) => {
        state.updateNotificationPrefRes.status = 'LOADING';
        return state;
      })
    );
    try {
      const res = await axios.put(
        `${BASE_URL}/api/notification/preferences`, pref,
        {
          headers: {
            Authorization: 'Bearer ' + get().loginStateRes.data,
          },
        }
      );
      set(
        produce((state: NotificationStore) => {
          state.updateNotificationPrefRes.status = 'SUCCESS';
          state.updateNotificationPrefRes.data = res.data;
          return state;
        })
      );
    } catch (e: any) {
      set(
        produce((state: NotificationStore) => {
          state.updateNotificationPrefRes.status = 'ERROR';
          state.updateNotificationPrefRes.data = null;
          state.updateNotificationPrefRes.error = e.response.data.message;
          return state;
        })
      );
    }
  },
});
