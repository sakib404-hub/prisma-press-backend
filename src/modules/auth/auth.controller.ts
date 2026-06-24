import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import authServices from "./auth.services";
import sendResponse2 from "../../utility/sendResponse2";
import status from "http-status"
import { AuthPayLoad } from "./auth.interface";

const loginUser = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

    const payLoad : AuthPayLoad = req.body;

    const {accessToken, refreshToken} = await authServices.longinUser(payLoad);

    //? setting up the cookie for the access Token
    res.cookie("accessToken", accessToken, {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 //? 24 hours or one day
    })


    //? setting up the cookie for the refreshToken
     res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 * 7 //? 7 days or 168 hours
    })



    sendResponse2(res, {
        success : true,
        statusCode : status.OK,
        message : "User Login Successfully",
        data : {
            accessToken,
            refreshToken
        }
    })

})

//? making an auth controller object and exporting it
const authController = {
    loginUser
}

export default authController;