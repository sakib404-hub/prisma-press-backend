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

    //? getting the event from the stripe webhook
    const event = req.body as Buffer;

    //? getting the signature
    const signature = req.headers['stripe-signature']! as string;


    const result = await subsbscriptionService.weebHookHandler(event , signature);


    return sendResponse2(res, {
        success : true,
        statusCode : status.OK,
        message : "Webhook handled successfully",
        data : null
    })

})

const getSubscriptionStatus = catchAsync(async(req : Request , res : Response, next : NextFunction)=>{
    
    const userId = req.user?.id;
    const result = await subsbscriptionService.getSubscriptionStatus(userId as string);

    return sendResponse2(res, {
        success : true,
        statusCode : status.OK,
        message : "Subscription Status retrived successfully",
        data : result
    });

})

export const subscriptionontroller = {
    createCheckOutSession,
    handleWeebHook,
    getSubscriptionStatus
}