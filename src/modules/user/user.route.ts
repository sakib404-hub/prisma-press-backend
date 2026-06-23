import { Router } from "express";
import userController from "./user.controller";

const router = Router();

router.post("/register", userController.creatingUser);
router.get('/getAll', userController.getAllUsers)

export const userRouter = router;