import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";

const createCheckOutSession = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

})

export const subscriptionontroller = {
    createCheckOutSession
}