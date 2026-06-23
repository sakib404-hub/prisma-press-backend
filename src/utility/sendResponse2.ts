import { Response } from "express";
import { IResponse2, TResponseData } from "../types/tresponseData";

const sendResponse2 = <T>(res : Response, data : TResponseData<T> )=>{

    const response : IResponse2<T> = {
        success : data.success,
        statusCode : data.statusCode,
        message : data.message,
    }

    if(data.data !== undefined){
        response.data = data.data;
    }

    if(data.meta !== undefined){
        response.meta = data.meta;
    }

    res.status(data.statusCode).json(response)
}


export default sendResponse2;