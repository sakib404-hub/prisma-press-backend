import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import sendResponse2 from "../../utility/sendResponse2";
import status from "http-status";
import { PremiumServices } from "./premium.service";

const getPremiumContent = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

    const result = await PremiumServices.getPremiumContent()

    return sendResponse2(res, {
        success : true,
        statusCode : status.OK,
        message : "Premium Content Retrive Successfully!",
        data : result
    })
})

export const PremiumController = {
    getPremiumContent
}