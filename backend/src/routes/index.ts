import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { leadsRouter } from "./leads.routes.js";
import { adminRouter } from "./admin.routes.js";
import { analyticsRouter } from "./analytics.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/leads", leadsRouter);
router.use("/admin", adminRouter);
router.use("/analytics", analyticsRouter);

export default router;
