type TBlogStatus = "DRAFT" | "PUBLISHED";

export interface ICreateBlog {
    title: string;
    subtitle?: string;
    content: string;
    status: TBlogStatus;
    authorName: string;
    tags?: string;
    file?: Express.Multer.File;
}