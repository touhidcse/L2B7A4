import { Router } from "express";
import { serviceController } from "./service.controller";

const router = Router();

// Public route - No authentication required
router.get("/", serviceController.getAllServicesWithFilter);

export const serviceRoutes = router;