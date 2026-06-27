import { NextFunction, Request, RequestHandler, Response } from "express";
import status from "http-status"
import sendResponse2 from "./sendResponse2";

const catchAsync = (fn : RequestHandler)=>{
    return async(req : Request, res : Response, next : NextFunction)=>{
        try{
            await fn(req, res, next);
        }catch(error){

            const errMessage = error instanceof Error ? error.message : "Something went Wrong!";

            return sendResponse2(res, {
                success : false,
                statusCode : status.INTERNAL_SERVER_ERROR,
                message : errMessage
            })
        }
    }
}

export default catchAsync;