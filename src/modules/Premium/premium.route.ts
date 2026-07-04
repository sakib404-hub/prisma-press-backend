import { Router } from "express";
import { PremiumController } from "./premium.controller";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../Middlewares/auth";
import premiumGuard from "../../Middlewares/premimumGuard";

const router = Router();

router.get('/', auth(Role.ADMIN, Role.AUTHOR, Role.USER), premiumGuard, PremiumController.getPremiumContent);


export const PremiumRouter = router;