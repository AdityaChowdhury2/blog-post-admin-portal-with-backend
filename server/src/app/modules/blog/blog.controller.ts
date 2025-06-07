import httpStatus from "http-status";
import { RequestHandler, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogService } from "./blog.service";
import fs from "fs";
import path from "path";

const createBlog: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    console.log("req.body", req.body);
    console.log("req.file", req.file);

    const tempFileName = req.file?.filename as string;
    const ext = path.extname(tempFileName || "");

    const newFileName = req.body.slug + ext;

    // Rename the file
    fs.renameSync(
      path.join("uploads", tempFileName),
      path.join("uploads", newFileName)
    );

    req.body.featuredImage = "/uploads/" + newFileName;

    const result = await BlogService.createBlogService(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Blog created successfully",
      data: result,
    });
  }
);

const getBlog: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const blogSlug = req.params.slug;
    const ip = req.ip as string;
    console.log("ip ====>", ip);

    const result = await BlogService.getBlogService(blogSlug, ip);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog retrieved successfully",
      data: result,
    });
  }
);

const getAllBlogs: RequestHandler = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const searchTerm = req.query.searchTerm as string;

  const result = await BlogService.getAllBlogsService(page, limit, searchTerm);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts retrieved successfully",
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getBlog,
  getAllBlogs,
};
