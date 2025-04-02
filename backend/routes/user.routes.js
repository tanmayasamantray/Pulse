import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, blockUser, unblockUser, getBlockedUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/blocked", protectRoute, getBlockedUsers);
router.post("/block/:id", protectRoute, blockUser);
router.post("/unblock/:id", protectRoute, unblockUser);

export default router;
