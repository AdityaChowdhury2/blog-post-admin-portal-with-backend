import { BlogStatus } from "@prisma/client";
import { z } from "zod";

const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    subTitle: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    status: z.enum(Object.values(BlogStatus) as [string, ...string[]]),
    authorName: z.string().min(1, "Author name is required"),
    tags: z.string().optional(),
  }),
});

const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    status: z.enum(Object.values(BlogStatus) as [string, ...string[]]),
    subTitle: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    featuredImage: z.string().optional(),
  }),
});

export const BlogValidation = {
  createBlogSchema,
  updateBlogSchema,
};
