import express from "express";
import {
  createPlan,
  getPlansByType,
  getPlanById,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";

const router = express.Router();

router.post("/", createPlan);
router.get("/type/:type", getPlansByType); // /type/weight-loss
router.get("/:id", getPlanById);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);

export default router;
