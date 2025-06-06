import { createBrowserRouter } from "react-router";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import BlogPostEditor from "../pages/BlogEditor";
import AllBlogs from "../pages/AllBlogs";
import Register from "../pages/Register";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/add-blog",
            element: <BlogPostEditor />,
          },
          {
            path: "/edit-blog/:id",
            element: <BlogPostEditor />,
          },
          {
            path: "/blogs",
            element: <AllBlogs />,
          },
        ],
      },
    ],
  },
]);
