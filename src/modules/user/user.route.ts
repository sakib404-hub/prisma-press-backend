import { NextFunction, Request, Response, Router } from "express";
import userController from "./user.controller";
import jwtutils from "../../utility/jwt";
import config from "../../config/dotenv";
import { Role } from "../../../generated/prisma/enums";
import sendResponse2 from "../../utility/sendResponse2";
import status from "http-status"

const router = Router();


declare global{
    namespace Express {
        interface Request {
            user ? : {
                id : string;
                name : string;
                email : string;
                role : Role
            }
        }
    }
}



router.post("/register", userController.registerUser);
router.get('/getAll', userController.getAllUsers);
router.get('/me',(req : Request, res : Response, next : NextFunction)=>{

    const { accessToken } = req.cookies;

    const verifyAccessToken = jwtutils.verifyToken(accessToken, config.jwt_secret);
    
    if(typeof verifyAccessToken === "string"){
        throw new Error(verifyAccessToken);
    }

    const {name, email, id, role} = verifyAccessToken;

    const requiredRoles = [Role.USER, Role.ADMIN, Role.AUTHOR];

    if(!requiredRoles.includes(role)){

        sendResponse2(res, {
            success : false,
            statusCode : status.FORBIDDEN,
            message : "Forbiddden Acees, you do not have the permission to access this"
        })
    }

    req.user = {
        id,
        name,
        email,
        role
    }

    next();

}, userController.getMyProfile)

export const userRouter = router;