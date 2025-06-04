import { baseApi } from "./apiSlice";
import { setToken, logout } from "../features/authSlice";
import { AxiosError } from "axios";

const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
        useAuth: false, // Optional: if axiosBaseQuery supports this
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.token;

          if (token) {
            dispatch(setToken(token));
          }
        } catch (error: unknown) {
          if (error instanceof AxiosError && error.response?.status === 401) {
            dispatch(logout());
          }
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
