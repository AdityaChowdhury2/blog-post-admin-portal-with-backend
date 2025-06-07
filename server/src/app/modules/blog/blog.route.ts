import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { BlogValidation } from "./blog.validation";
import { authenticateJWT } from "../../middlewares/auth.middleware";
import { BlogController } from "./blog.controller";
import { imageUpload } from "../../middlewares/upload.middleware";

const router = Router();

router.post(
  "/",
  authenticateJWT,
  imageUpload.single("featuredImage"),
  validateRequest(BlogValidation.createBlogSchema),
  BlogController.createBlog
);

router.get("/", BlogController.getAllBlogs);

router.get("/:slug", BlogController.getBlog);

export const BlogRoutes = router;
