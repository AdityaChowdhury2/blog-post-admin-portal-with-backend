import { axiosBaseQuery } from "./axiosBaseQuery";
import { loginSuccess, logout, type User } from "../redux/features/authSlice";
import { setLocalStorage } from "./localStorage";

import type { BaseQueryFn } from "@reduxjs/toolkit/query";
interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  errorSources?: {
    [key: string]: string;
  };
  stack?: string;
}

export const axiosBaseQueryWithReauth: () => BaseQueryFn<
  Parameters<ReturnType<typeof axiosBaseQuery>>[0], // Args
  unknown,
  { status?: number; data?: unknown }
> = () => async (args, api, extraOptions) => {
  let result = await axiosBaseQuery()(args, api, extraOptions);

  console.log("result ===>", result);

  if (result.error && result.error.status === 401) {
    const refreshResult = await axiosBaseQuery()(
      {
        url: "/auth/refresh-token",
        method: "POST",
        useAuth: false,
      },
      api,
      extraOptions
    );

    console.log("refreshResult ===>", refreshResult);

    if (
      refreshResult.data &&
      (refreshResult.data as Response<{ accessToken: string; user: User }>).data
        ?.accessToken
    ) {
      const { accessToken, user } = (
        refreshResult.data as Response<{ accessToken: string; user: User }>
      ).data;

      setLocalStorage("token", accessToken);

      api.dispatch(loginSuccess(user));

      // Retry the original request
      result = await axiosBaseQuery()(args, api, extraOptions);
    } else {
      await axiosBaseQuery()(
        {
          url: "/auth/logout",
          method: "DELETE",
          useAuth: false,
        },
        api,
        extraOptions
      );
      api.dispatch(logout());
    }
  }

  return result;
};
