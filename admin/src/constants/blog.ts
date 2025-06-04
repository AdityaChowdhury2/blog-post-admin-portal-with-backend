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
  status: "DRAFT" | "PUBLISHED";
}

export interface UpdateBlogRequest extends CreateBlogRequest {
  id: string;
}
