import prisma from "../../config/prisma";
import slugify from "slugify";

import viewCache from "../../utils/viewCache";
import { ICreateBlog } from "./blog.interface";

const createBlogService = async (payload: ICreateBlog) => {
  const {
    title,
    subTitle,
    content,
    status,
    authorName,
    tags,
    slug,
    featuredImage,
  } = payload;

  let tagsArray: (string | null)[] = [];
  if (tags) {
    tagsArray = tags.split(",").map((tag: string) => {
      if (tag.trim() === "") return null;
      return tag.trim();
    });
  }

  console.log("tagsArray ====>", tagsArray);

  // Wrap in transaction
  const post = await prisma.$transaction(async (tx: any) => {
    // Upsert tags inside the same transaction
    const tagObjs = await Promise.all(
      tagsArray.map(async (tagName: string | null) => {
        if (!tagName) return null;
        const tagSlug = slugify(tagName, { lower: true, strict: true });
        return tx.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
      })
    );

    // Create post and connect tags
    const createdPost = await tx.blog.create({
      data: {
        title,
        subTitle,
        content,
        status,
        slug,
        featuredImage,
        authorName,
        tags: { connect: tagObjs.map((tag) => ({ id: tag.id })) },
      },
      include: { tags: true },
    });

    return createdPost;
  });

  return post;
};

const getAllBlogsService = async (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = ""
) => {
  const skip = (page - 1) * limit;

  // Build search filter
  const searchFilter = searchTerm
    ? {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { authorName: { contains: searchTerm, mode: "insensitive" } },
        ],
      }
    : {};

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      skip,
      take: limit,
      where: searchFilter,
      orderBy: { createdAt: "desc" },
      include: { tags: true },
    }),
    prisma.blog.count({ where: searchFilter }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: blogs,
  };
};

const getBlogService = async (blogSlug: string, ip: string) => {
  const cacheKey = `viewed_${blogSlug}_${ip}`;

  const blog = await prisma.blog.findUnique({
    where: { slug: blogSlug },
    include: { tags: true },
  });

  if (!blog) {
    throw new Error("Blog not found");
  }

  // Throttle views using IP + post ID
  if (!viewCache.get(cacheKey)) {
    await prisma.blog.update({
      where: { slug: blogSlug },
      data: { viewCount: { increment: 1 } },
    });
    viewCache.set(cacheKey, true);
  }

  return blog;
};

const updateBlogService = async (blogSlug: string, payload: ICreateBlog) => {
  const { title, subTitle, content, status, authorName, featuredImage } =
    payload;

  const blog = await prisma.blog.update({
    where: { slug: blogSlug },
    data: {
      title,
      subTitle,
      content,
      status,
      authorName,
      featuredImage,
    },
  });

  return blog;
};

export const BlogService = {
  createBlogService,
  getAllBlogsService,
  getBlogService,
  updateBlogService,
};
