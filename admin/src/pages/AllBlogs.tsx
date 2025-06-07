import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { LuPencil, LuTrash2, LuMoveHorizontal } from "react-icons/lu";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";

import { LuLoader } from "react-icons/lu";
import type { Blog } from "../interface/blog";
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
} from "../redux/api/blogApiSlice";
import { Helmet } from "react-helmet-async";

const BlogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  // RTK Query hooks
  const { data, isLoading } = useGetBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();

  console.log("data", data?.data);

  const blogs = data?.data?.data as Blog[];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // const filteredPosts = (posts).filter((post: { title: string }) =>
  //     post.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleDeletePost = async (id: string) => {
    try {
      await deleteBlog(id).unwrap();
      setDeletePostId(null);
      toast.success("Post deleted", {
        description: "The post has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LuLoader className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>All Blogs | MISCOM</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-600 text-3xl">Posts</h1>
            <p className="text-muted-foreground font-bold">
              Manage all your blog posts.
            </p>
          </div>
          <Link to="/add-blog">
            <Button>New Post</Button>
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <div className="w-64">
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearch}
              className="bg-blue-100 text-slate-800 font-bold"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>{blog.status}</TableCell>
                  <TableCell>{blog.authorName}</TableCell>
                  <TableCell>
                    {new Date(blog.createdAt || "").toLocaleDateString()}
                  </TableCell>
                  <TableCell>0</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <LuMoveHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/edit-blog/${blog?.slug}`}>
                            <LuPencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeletePostId(blog?.slug || "")}
                        >
                          <LuTrash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog
        open={!!deletePostId}
        onOpenChange={() => setDeletePostId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && handleDeletePost(deletePostId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BlogsPage;
