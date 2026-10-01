import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authService, AuthResponse, LoginCredentials, RegisterCredentials, User } from '../services/authService';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
  initialized: boolean;
  isGuest: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
  initialized: false,
  isGuest: false,
};

export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  const response = await authService.login(credentials);
  if (!response.success || !response.user || !response.token) {
    return rejectWithValue(response.error || 'Login failed.');
  }
  return response;
});

export const register = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>('auth/register', async (credentials, { rejectWithValue }) => {
  const response = await authService.register(credentials);
  if (!response.success || !response.user || !response.token) {
    return rejectWithValue(response.error || 'Registration failed.');
  }
  return response;
});

export const restoreSession = createAsyncThunk<
  { user: User | null; token: string | null },
  void,
  { rejectValue: string }
>('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.restoreSession();
    if (!user) {
      return { user: null, token: null };
    }

    const token = await authService.getToken();
    return { user, token };
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Unable to restore session.');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    enterGuest(state) {
      state.isGuest = true;
      state.error = null;
    },
    exitGuest(state) {
      state.isGuest = false;
      state.error = null;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.status = 'authenticated';
        state.error = null;
        state.initialized = true;
        state.isGuest = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload || 'Login failed.';
        state.initialized = true;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.status = 'authenticated';
        state.error = null;
        state.initialized = true;
        state.isGuest = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload || 'Registration failed.';
        state.initialized = true;
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = action.payload.user ? 'authenticated' : 'unauthenticated';
        state.error = null;
        state.initialized = true;
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.status = 'unauthenticated';
        state.error = action.payload || 'Unable to restore session.';
        state.initialized = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'unauthenticated';
        state.error = null;
        state.initialized = true;
      });
  },
});

export const { clearAuthError, setUser, enterGuest, exitGuest } = authSlice.actions;
export default authSlice.reducer;
