import type { BlogStatus } from "@prisma/client";

export interface ICreateBlog {
  title: string;
  subtitle?: string;
  content: string;
  status: BlogStatus;
  authorName: string;
  tags?: string;
  slug: string;
  featuredImage: string;
  file?: Express.Multer.File;
}
