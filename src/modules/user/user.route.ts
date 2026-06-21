import { Router } from "express";
import userController from "./user.controller";

const router = Router();

router.post("/register", userController.creatingUser)

export const userRouter = router;