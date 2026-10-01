import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from './authSlice';
import { apiClient } from '../services/apiClient';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});


apiClient.setUnauthorizedHandler(() => {
  if (store.getState().auth.status === 'authenticated') {
    store.dispatch(logout());
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
