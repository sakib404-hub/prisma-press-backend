import { Router } from "express";
import { subscriptionontroller } from "./subscription.controller";
import auth from "../../Middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post('/checkOut',auth(Role.USER, Role.ADMIN, Role.AUTHOR), subscriptionontroller.createCheckOutSession);

export const subscriptionRouter = router;