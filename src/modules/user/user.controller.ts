import { NextFunction, Request, RequestHandler, Response } from "express";
import HttpStatus from "http-status";
import userService from "./user.services";
import sendResponse from "../../utility/sendResponse";
import catchAsync from "../../utility/catchAsync";
import jwt from "jsonwebtoken"
import config from "../../config/dotenv";
import jwtutils from "../../utility/jwt";
import { verify } from "node:crypto";
import sendResponse2 from "../../utility/sendResponse2";




const creatingUser = async (req: Request, res: Response) => {
    try{
    const payload = req.body;

    const user = await userService.createUserIntoDB(payload);

    sendResponse(res, HttpStatus.CREATED, true, "User Registratation Successfull", user)

    }catch(err){

        // console.error(err);
        const errMessage = err instanceof Error ? err.message : "Something went Wrong";

        return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, false, errMessage);
    }
}


const registerUser = catchAsync(async(req : Request, res : Response, next : NextFunction )=>{

    const payload = req.body;

    const user = await userService.createUserIntoDB(payload);

    sendResponse(res, HttpStatus.CREATED, true, "User Registratation Successfull", user)

})

//? getting me only valid for the user himself or the admin
const getMyProfile = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

    const {accessToken} = req.cookies;
    
    const verifyToken = jwtutils.verifyToken(accessToken, config.jwt_secret);

    if(typeof verifyToken === "string"){
        throw new Error(verifyToken);
    }

    const user = await userService.getMyProfileFromDB(verifyToken.id);

    sendResponse2(res, {
        success : true,
        statusCode : HttpStatus.OK,
        message : "User Information with profile fetched successfully",
        data : user
    })

})


//? getting all the users
const getAllUsers = async(req : Request, res : Response)=>{
    try{

        const users = await userService.getAllUsersFromDB();

        sendResponse(res,HttpStatus.OK, true, "User Information fetched successfully!", users);

    }catch(err){
        
        const errMessage = err instanceof Error ? err.message : "Something went Wrong!";

        return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, false, errMessage);

    }
}

const userController = {
    creatingUser,
    registerUser,
    getAllUsers,
    getMyProfile
}

export default userController;