import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { subsbscriptionService } from "./subscription.service";
import sendResponse2 from "../../utility/sendResponse2";
import status from "http-status";

const createCheckOutSession = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

    const userId = req.user?.id as string;

    const result = await subsbscriptionService.createCheckhOutSession(userId);

    return sendResponse2(res, {
        success : true,
        statusCode : status.OK,
        message : "Checkout Completely successsfull",
        data : result
    })

});


const handleWeebHook = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

})

export const subscriptionontroller = {
    createCheckOutSession,
    handleWeebHook
}