import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import authServices from "./auth.services";
import sendResponse2 from "../../utility/sendResponse2";
import status from "http-status"
import { AuthPayLoad } from "./auth.interface";

const loginUser = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

    const payLoad : AuthPayLoad = req.body;

    const loginResult = await authServices.longinUser(payLoad);

    sendResponse2(res, {
        success : true,
        statusCode : status.OK,
        message : "User Login Successfully",
        data : loginResult
    })

})


//? making an auth controller object and exporting it
const authController = {
    loginUser
}

export default authController;