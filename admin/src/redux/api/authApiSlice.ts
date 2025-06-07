import { baseApi } from "./apiSlice";
import { AxiosError } from "axios";
import { loginSuccess, logout } from "../features/authSlice";
import { setLocalStorage } from "../../lib/localStorage";

const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
        useAuth: false, // Optional: normally it's false for public routes
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          // console.log("queryFulfilled", queryFulfilled);
          const { data } = await queryFulfilled;
          // console.log("data in authApiSlice", data);
          if (data.success) {
            setLocalStorage("token", data.data.accessToken);
            setLocalStorage("user", data.data.user);
            dispatch(loginSuccess(data.data.user));
          }
        } catch (error: unknown) {
          console.log("error", error);
          if (error instanceof AxiosError && error.response?.status === 401) {
            dispatch(logout());
          }
        }
      },
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        data: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error: unknown) {
          console.log("error", error);
          if (error instanceof AxiosError && error.response?.status === 401) {
            dispatch(logout());
          }
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApiSlice;
