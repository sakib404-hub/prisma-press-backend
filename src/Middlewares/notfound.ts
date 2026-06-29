import { Request, Response } from "express"
import status from "http-status"

export const notFound = (req : Request, res : Response)=>{
    return res.status(404).json({
        success : false,
        statusCode : status.NOT_FOUND,
        message : "Route not found!",
        path : req.originalUrl,
        date : Date()
    })
}