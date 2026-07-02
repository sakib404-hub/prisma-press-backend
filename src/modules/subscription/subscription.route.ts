import { Router } from "express";
import { subscriptionontroller } from "./subscription.controller";
import auth from "../../Middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post('/checkOut',auth(Role.USER, Role.ADMIN, Role.AUTHOR), subscriptionontroller.createCheckOutSession);

router.post('/webhook', subscriptionontroller.handleWeebHook);

router.get('/status', auth(Role.USER, Role.AUTHOR, Role.ADMIN), subscriptionontroller.getSubscriptionStatus);

export const subscriptionRouter = router;