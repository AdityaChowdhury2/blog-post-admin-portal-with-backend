import { useState, lazy, Suspense, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { LuLoader } from "react-icons/lu";
import { FileUpload } from "../components/ui/file-upload";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import {
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
} from "../redux/api/blogApiSlice";

// Import your custom components as needed
// import  Button, Label, Input, Card, CardHeader, CardTitle, CardContent, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem

const ReactQuill = lazy(() => import("react-quill-new"));

// Blog post form data type
interface BlogFormData {
  title: string;
  content: string;
  author: string;
  subTitle: string;
  tags: string;
  featuredImage: File;
}

// Mock category data
// const categories = [
//     { id: 1, name: "Web Development" },
//     { id: 2, name: "UI/UX Design" },
//     { id: 3, name: "DevOps" },
//     { id: 4, name: "Mobile Development" },
// ];

const BlogPostEditor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const isEdit = !!id;

  // RTK Query hooks
  const [createBlogPost] = useCreateBlogMutation();
  const [updateBlogPost] = useUpdateBlogMutation();
  const { data: existingPost, isLoading: isLoadingPost } = useGetBlogQuery(
    id || "",
    {
      skip: !isEdit,
    }
  );

  // React Hook Form setup
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BlogFormData>({
    defaultValues: {
      title: "",
      subTitle: "",
      content: "",
      author: "",
      tags: "",
      featuredImage: undefined,
    },
  });

  // If we're editing, fetch the post data
  useEffect(() => {
    if (isEdit && existingPost) {
      // reset({
      //   title: existingPost.title,
      //   content: existingPost.content,
      //   author: existingPost.author,
      //   subTitle: existingPost.subTitle,
      //   tags: existingPost.tags,
      //   featuredImage: null // You'd set this from your API response
      // });
    }
  }, [isEdit, existingPost, reset]);

  // Handle image upload preview
  const handleImageUpload = (file: File | null) => {
    if (file) {
      setValue("featuredImage", file);
    }
  };

  const handleImagePreviewChange = (preview: string | null) => {
    // We don't need to do anything with the preview in this implementation
    // But we need to provide this function to the FileUpload component
    console.log(preview);
  };

  const handlePreview = () => {
    // Implementation for preview functionality would go here
    toast("Preview functionality not implemented yet");
  };

  // Form submission handlers
  const onSubmit = async (
    data: BlogFormData,
    status: "DRAFT" | "PUBLISHED"
  ) => {
    setIsSubmitting(true);

    console.log("data", data);

    try {
      const blogData = {
        title: data.title,
        content: data.content,
        authorName: data.author,
        subTitle: data.subTitle,
        tags: data.tags,
        status,
        featuredImage: data.featuredImage,
      };

      console.log("blogData", blogData);

      if (isEdit && id) {
        // Update existing post
        await updateBlogPost({
          id,
          title: data.title,
          content: data.content,
          subTitle: data.subTitle,
          tags: data.tags,
          featuredImage: data.featuredImage,
          authorName: data.author,
          status: status,
        }).unwrap();
        toast.success("Blog post updated successfully!");
      } else {
        // Create new post
        await createBlogPost({
          title: data.title,
          content: data.content,
          subTitle: data.subTitle,
          tags: data.tags,
          featuredImage: data.featuredImage,
          authorName: data.author,
          status: status,
        }).unwrap();
        toast.success("Blog post created successfully!");
      }

      // Navigate back to posts list
      navigate("/blogs");
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error("Failed to save blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = () => {
    handleSubmit((data) => onSubmit(data, "DRAFT"))();
  };

  const handlePublish = () => {
    handleSubmit((data) => onSubmit(data, "PUBLISHED"))();
  };

  if (isLoadingPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LuLoader className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">
              {isEdit ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-muted-foreground">
              {isEdit
                ? "Make changes to your existing post."
                : "Write and publish a new blog post."}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              className="bg-blue-100"
              variant="outline"
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              className="bg-blue-100"
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            <Button onClick={handlePublish} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Publish"}
            </Button>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                className="bg-blue-100"
                id="title"
                placeholder="Enter post title"
                {...register("title", {
                  required: "Title is required",
                })}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subTitle">Sub Title</Label>
              <Input
                className="bg-blue-100"
                id="subTitle"
                placeholder="Enter sub title"
                {...register("subTitle")}
              />
              {errors.subTitle && (
                <p className="text-sm text-red-500">
                  {errors.subTitle.message}
                </p>
              )}
            </div>

            {/* Quill Editor */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-lg">
                Content
              </Label>
              <Suspense
                fallback={
                  <div className="min-h-[400px] font-mono flex items-center justify-center">
                    <LuLoader className="animate-spin" />
                  </div>
                }
              >
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "Content is required" }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write your post content here... Markdown supported."
                      className="min-h-[300px] font-mono bg-blue-100 rounded"
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </Suspense>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-blue-100 rounded-t">
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    {...register("author", {
                      required: "Author is required",
                    })}
                  />
                  {errors.author && (
                    <p className="text-sm text-red-500">
                      {errors.author.message}
                    </p>
                  )}
                </div>

                {/* <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Controller
                                        name="categoryId"
                                        control={control}
                                        rules={{ required: "Please select a category" }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.categoryId && (
                                        <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                                    )}
                                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Comma-separated tags"
                    {...register("tags", {
                      required: "At least one tag is required",
                    })}
                  />
                  {errors.tags && (
                    <p className="text-sm text-red-500">
                      {errors.tags.message}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Separate tags with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image</Label>
                  <FileUpload
                    onChange={handleImageUpload}
                    onPreviewChange={handleImagePreviewChange}
                  />
                  {errors.featuredImage && (
                    <p className="text-sm text-red-500">
                      {errors.featuredImage.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </>
  );
};

export default BlogPostEditor;
