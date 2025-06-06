import { BlogStatus } from "../constants/blog.constant";

export type BlogStatus = (typeof BlogStatus)[number];

// Define our blog types
export interface Blog {
  id: string;
  title: string;
  content: string;
  authorName: string;
  subTitle: string;
  tags: string;
  featuredImage: File;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface BlogResponse {
  success: boolean;
  message?: string;
  data?: {
    data: Blog | Blog[];
    total: number;
    page: number;
    limit: number;
  };
}

// Define request types
export interface CreateBlogRequest {
  title: string;
  content: string;
  authorName: string;
  subTitle: string;
  tags: string;
  featuredImage: File;
  status: BlogStatus;
}

export interface UpdateBlogRequest extends CreateBlogRequest {
  id: string;
}
