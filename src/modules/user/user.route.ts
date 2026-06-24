import { NextFunction, Request, Response, Router } from "express";
import userController from "./user.controller";
import jwtutils from "../../utility/jwt";
import config from "../../config/dotenv";
import { Role } from "../../../generated/prisma/enums";
import sendResponse2 from "../../utility/sendResponse2";
import status from "http-status"
import catchAsync from "../../utility/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

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


const auth = (...requiredRoles : Role[])=>{
    return catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

        const token = req.cookies.accessToken ;
        // || 
        // req.headers.authorization?.startsWith("Bearer") ? 
        // req.headers.authorization?.split(" ")[1] 
        // : req.headers.authorization;

        if(!token){
            throw new Error("You are not logged in! please login first");
        }

        const verifyToken = jwtutils.verifyToken(token, config.jwt_secret);

        if(verifyToken.success === false){
            throw new Error(verifyToken.message);
        }

        const {id, name , email, role } = verifyToken.data as JwtPayload;


         if(requiredRoles && !requiredRoles.includes(role)){
            sendResponse2(res, {
            success : false,
            statusCode : status.FORBIDDEN,
            message : "Forbiddden Acees, you do not have the permission to access this"
        })
    }

    const user = await prisma.user.findUnique({
        where : {
            id,
            email,
            name
        },
        omit : {
            password : true
        }
    })

    if(!user){
        throw new Error("User Does not Exist!");
    }

    if(user.activeStatus === "BlOCKED"){
        throw new Error("Your account has been blocked, please contact with support!");
    }

        req.user = {
            id,
            name,
            email,
            role
        }

    next();

    })

}



router.post("/register", userController.registerUser);
router.get('/getAll', userController.getAllUsers);
router.get('/me',auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.getMyProfile)

export const userRouter = router;