import { Response } from "express";
import { IResponse } from "../types/response";


const sendResponse = <T>(res : Response, statusCode : number, success : boolean, message : string, data ? : T, err ? : string) =>{

    const response : IResponse<T> = {
        success,
        message
    }

    if(data !== undefined){
        response.data = data
    }

    if(err !== undefined){
        response.error = err;
    }

    return res.status(statusCode).json(response);
}

export default sendResponse;