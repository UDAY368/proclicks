import { Router } from "express";
import {
  createLead,
  deleteLead,
  listLeads,
  markLeadReviewed,
  updateLeadRemark,
} from "../controllers/leads.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdminAuth } from "../middleware/requireAdminAuth.js";

export const leadsRouter = Router();

leadsRouter.post("/", asyncHandler(createLead));
leadsRouter.get("/", requireAdminAuth, asyncHandler(listLeads));
leadsRouter.patch("/:id/review", requireAdminAuth, asyncHandler(markLeadReviewed));
leadsRouter.patch("/:id/remark", requireAdminAuth, asyncHandler(updateLeadRemark));
leadsRouter.delete("/:id", requireAdminAuth, asyncHandler(deleteLead));
