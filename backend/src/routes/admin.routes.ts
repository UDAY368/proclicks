import { Router } from "express";
import { loginAdmin } from "../controllers/adminAuth.controller.js";
import { getAnalyticsOverview } from "../controllers/analytics.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdminAuth } from "../middleware/requireAdminAuth.js";

export const adminRouter = Router();

adminRouter.post("/login", asyncHandler(loginAdmin));
adminRouter.get("/analytics", requireAdminAuth, asyncHandler(getAnalyticsOverview));
