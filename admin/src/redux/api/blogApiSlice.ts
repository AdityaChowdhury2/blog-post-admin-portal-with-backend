// redux/api/blogApiSlice.ts
import { baseApi } from "./apiSlice";
import type {
  CreateBlogRequest,
  GetAllBlogsResponse,
  GetSingleBlogResponse,
  UpdateBlogRequest,
} from "../../interface/blog";

export const blogApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // PUBLIC
    getBlogs: builder.query<GetAllBlogsResponse, void>({
      query: () => ({
        url: "/blog",
        method: "GET",
        useAuth: false, // 👈 public access
      }),
      providesTags: ["Blogs"],
    }),
    getBlog: builder.query<GetSingleBlogResponse, string>({
      query: (slug) => ({
        url: `/blog/${slug}`,
        method: "GET",
        useAuth: false, // 👈 public access
      }),
      providesTags: ["Blog"],
    }),

    // AUTHENTICATED
    createBlog: builder.mutation<GetSingleBlogResponse, CreateBlogRequest>({
      query: (blog) => {
        console.log("=== Create Blog Mutation ===");
        console.log("Raw blog data:", blog);
        console.log(
          "Featured Image type:",
          blog.featuredImage ? typeof blog.featuredImage : "undefined"
        );
        console.log(
          "Featured Image instanceof File:",
          blog.featuredImage instanceof File
        );
        console.log(
          "Featured Image keys:",
          blog.featuredImage ? Object.keys(blog.featuredImage) : "none"
        );

        const formData = new FormData();

        // Append all text fields
        Object.entries(blog).forEach(([key, value]) => {
          console.log(`Processing field: ${key}`, value);

          if (key === "tags") {
            // Handle tags array
            formData.append(key, value as string);
            console.log(`Appended tags: ${value}`);
          } else if (key === "featuredImage" && typeof value === "object") {
            // Handle file upload
            formData.append(key, value);
            console.log(`Appended featuredImage:`, value);
          } else if (value !== undefined && value !== null) {
            // Handle other fields
            formData.append(key, value.toString());
            console.log(`Appended ${key}: ${value}`);
          }
        });

        // Log the final FormData contents
        console.log("FormData entries:");
        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        return {
          url: "/blog",
          method: "POST",
          data: formData,
          // headers: {
          // "Content-Type": "multipart/form-data",
          // Don't set Content-Type, let the browser set it with the boundary
          // Accept: "application/json",
          // },
          useAuth: true, // 🔐 needs auth
        };
      },
      invalidatesTags: ["Blogs"],
    }),
    updateBlog: builder.mutation<GetSingleBlogResponse, UpdateBlogRequest>({
      query: ({ slug, ...blog }) => {
        console.log("=== Update Blog Mutation ===");
        console.log("Raw blog data:", blog);
        console.log(
          "Featured Image type:",
          blog.featuredImage ? typeof blog.featuredImage : "undefined"
        );
        console.log(
          "Featured Image instanceof File:",
          blog.featuredImage instanceof File
        );
        console.log(
          "Featured Image keys:",
          blog.featuredImage ? Object.keys(blog.featuredImage) : "none"
        );

        const formData = new FormData();

        // Append all text fields
        Object.entries(blog).forEach(([key, value]) => {
          console.log(`Processing field: ${key}`, value);

          if (key === "tags") {
            // Handle tags array
            formData.append(key, JSON.stringify(value));
            console.log(`Appended tags: ${JSON.stringify(value)}`);
          } else if (key === "featuredImage" && typeof value === "object") {
            // Handle file upload
            formData.append(key, value as Blob);
            console.log(`Appended featuredImage:`, value);
          } else if (value !== undefined && value !== null) {
            // Handle other fields
            formData.append(key, value.toString());
            console.log(`Appended ${key}: ${value}`);
          }
        });

        // Log the final FormData contents
        console.log("FormData entries:");
        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        return {
          url: `/blog/${slug}`,
          method: "PUT",
          data: formData,
          headers: {
            // Don't set Content-Type, let the browser set it with the boundary
            Accept: "application/json",
          },
          useAuth: true, // 🔐 needs auth
        };
      },
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation<GetSingleBlogResponse, string>({
      query: (slug) => ({
        url: `/blog/${slug}`,
        method: "DELETE",
        useAuth: true, // 🔐 needs auth
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApiSlice;
