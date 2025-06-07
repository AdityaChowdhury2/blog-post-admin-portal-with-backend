import { baseApi } from "./apiSlice";
import { logout, loginSuccess } from "../features/authSlice";
import { AxiosError } from "axios";

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
            dispatch(loginSuccess(data.data));
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
