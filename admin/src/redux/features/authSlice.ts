import { createSlice } from "@reduxjs/toolkit";

// Define auth state interface
interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  token: localStorage.getItem("token"),
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
      if (action.payload?.token) {
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload || "Login failed";
    },
  },
});

// Export actions and reducer
export const {
  logout,
  clearError,
  setToken,
  setLoading,
  setError,
  loginSuccess,
  loginFailure,
} = authSlice.actions;
export default authSlice.reducer;
