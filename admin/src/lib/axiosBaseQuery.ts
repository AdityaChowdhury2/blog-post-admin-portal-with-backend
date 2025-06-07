// lib/axiosBaseQuery.ts
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import axiosInstance from "./axios";
import { axiosPublic } from "./axios";

interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  useAuth?: boolean; // 🔑 flag to choose axios instance
}

type AxiosBaseQueryError = { status?: number; data?: unknown };

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method, data, params, useAuth = false }) => {
    console.log(
      `📡 AxiosBaseQuery Called → ${method} ${url} (useAuth: ${useAuth})`
    );

    const client = useAuth ? axiosInstance : axiosPublic;

    try {
      const result = await client({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      console.log("err", err);
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };
