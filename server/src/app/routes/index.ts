import { Router } from "express";

import { HealthRoutes } from "../modules/health/health.route";


const router = Router();
const moduleRoutes = [
  {
    path: "/health",
    route: HealthRoutes,
  },
  // {
  //   path: "/auth",
  //   route: AuthRoutes,
  // },
  // {
  //   path: "/blogs",
  //   route: BlogRoutes,
  // },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
