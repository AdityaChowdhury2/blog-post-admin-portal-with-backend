import { BlogStatus } from "../constants/blog.constant";

export type BlogStatus = (typeof BlogStatus)[number];
export interface ITag {
  name: string;
  slug: string;
}

// Define our blog types
export interface Blog {
  id?: string;
  title: string;
  content: string;
  slug: string;
  authorName: string;
  subTitle: string;
  tags: ITag[] | string;
  featuredImage: File;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface GetAllBlogsResponse {
  success: boolean;
  message?: string;
  data?: {
    data: Blog | Blog[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface GetSingleBlogResponse {
  success: boolean;
  message?: string;
  data?: Blog;
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
  slug: string;
}

export interface UpdateBlogRequest extends CreateBlogRequest {
  id: string;
}
