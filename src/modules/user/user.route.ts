import { Router } from "express";
import userController from "./user.controller";

const router = Router();

router.post("/user/register", userController.creatingUser);
router.get('/users', userController.getAllUsers)

export const userRouter = router;