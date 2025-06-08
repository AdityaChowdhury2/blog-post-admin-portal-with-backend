import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQueryWithReauth } from "../../lib/axiosBaseQueryWithReauth";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQueryWithReauth(),
  endpoints: () => ({}),
  tagTypes: ["Blogs", "Blog"],
});
