import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../services/authApi';

interface UserState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Проверяем, доступен ли localStorage (только на клиенте)
const isBrowser = typeof window !== 'undefined';

const initialState: UserState = {
  user: null,
  token: isBrowser ? localStorage.getItem('token') : null,
  isAuthenticated: isBrowser ? !!localStorage.getItem('token') : false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserData; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      if (isBrowser) {
        localStorage.setItem('token', token);
      }
    },
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (isBrowser) {
        localStorage.removeItem('token');
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCredentials,
  setUser,
  logout,
  setError,
  clearError,
  setLoading,
} = userSlice.actions;

export default userSlice.reducer; 