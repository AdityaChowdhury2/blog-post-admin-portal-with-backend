import { Router } from "express";

import { HealthRoutes } from "../modules/health/health.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BlogRoutes } from "../modules/blog/blog.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/health",
    route: HealthRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/blog",
    route: BlogRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
