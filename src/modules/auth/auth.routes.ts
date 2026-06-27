import { Router } from "express";
import authController from "./auth.controller";

const router = Router();

router.post('/login', authController.loginUser);

router.post('/refresh-token', authController.refreshToken); //? with the help of refresh token we provide a new access token to the user

export const authRouter = router;