import { Router } from "express"
import { serviecController } from "./service.controller";


const router = Router();

router.get("/", serviecController.getAllServicesWithFilter)

export const serviceRoutes = router;