import { Router } from "express";

import authRoutes from './auth'
import friendsRoutes from './friends'

const router = Router();

router.use("/auth", authRoutes);
router.use("/friends", friendsRoutes);

export default router;
