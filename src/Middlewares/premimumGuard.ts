import { NextFunction, Request, Response } from "express";
import catchAsync from "../utility/catchAsync";
import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../generated/prisma/enums";

const premiumGuard = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

    const userId = req.user?.id;

    const subscription = await prisma.subscription.findUnique({
        where : {
            userId
        }
    });

    if(!subscription){
        throw new Error("You are not subscribed, please subscribe to access premium content!");
    }

    if(subscription?.status === SubscriptionStatus.ACTIVE){
        throw new Error("Please subscribe again to for getting access to premium content!");
    }

})

export default premiumGuard;