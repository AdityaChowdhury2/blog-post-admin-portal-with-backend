import { createSlice } from "@reduxjs/toolkit";
import { UserRole } from "../../constants/user.constant";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "../../lib/localStorage";

export interface User {
  id: string;
  email: string;
  name: string;
  role: (typeof UserRole)[number];
}
// Define auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  user: getLocalStorage("user"),
  isAuthenticated:
    getLocalStorage("user") && getLocalStorage("token") ? true : false,
  isLoading: false,
  error: null,
  token: getLocalStorage("token"),
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      removeLocalStorage("token");
      removeLocalStorage("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      if (action.payload?.accessToken) {
        state.token = action.payload.accessToken;
        setLocalStorage("token", action.payload.accessToken);
        setLocalStorage("user", action.payload.user);
      }
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload || "Login failed";
    },
    // TODO: Add action for token refresh
    // refreshToken: (state, action: PayloadAction<string>) => {
    //   state.token = action.payload;
    //   localStorage.setItem("authToken", action.payload);
    // },
  },
});

// Export actions and reducer
export const {
  logout,
  clearError,
  setLoading,
  setError,
  loginSuccess,
  loginFailure,
} = authSlice.actions;
export default authSlice.reducer;
