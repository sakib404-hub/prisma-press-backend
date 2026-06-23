import { NextFunction, Request, RequestHandler, Response } from "express";
import status from "http-status"
import sendResponse from "./sendResponse";

const catchAsync = (fn : RequestHandler)=>{
    return async(req : Request, res : Response, next : NextFunction)=>{
        try{
            await fn(req, res, next);
        }catch(error){

            const errMessage = error instanceof Error ? error.message : "Something went Wrong!";

            return sendResponse(res, status.INTERNAL_SERVER_ERROR, false, errMessage);

        }
    }
}

export default catchAsync;