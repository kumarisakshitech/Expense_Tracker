import express from "express";
import { getDashboardOverview } from "../controllers/dashboardController.js";

// ❌ galat (tumne ye likha tha)
// import authMiddleware from "../middleware/auth.js";


// ✅ correct (named import)
import { authMiddleware } from "../middleware/auth.js";

const dashboardRouter = express.Router();

// ✅ clean route
dashboardRouter.get("/", authMiddleware, getDashboardOverview);

export default dashboardRouter;