import { Request, Response } from "express";
import HttpStatus from "http-status";
import userService from "./user.services";
import sendResponse from "../../utility/sendResponse";



const creatingUser = async (req: Request, res: Response) => {
    try{
    const payload = req.body;

    const user = await userService.createUserIntoDB(payload);

    sendResponse(res, HttpStatus.CREATED, true, "User Registratation Successfull", user)

    }catch(err){

        // console.error(err);
        const errMessage = err instanceof Error ? err.message : "Something went Wrong";

        return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, false, errMessage);
    }
}

const getAllUsers = async(req : Request, res : Response)=>{
    try{

        const users = await userService.getAllUsersFromDB();

        sendResponse(res,HttpStatus.OK, true, "User Information fetched successfully!", users);

    }catch(err){
        
        const errMessage = err instanceof Error ? err.message : "Something went Wrong!";

        return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, false, errMessage);

    }
}

const userController = {
    creatingUser,
    getAllUsers
}

export default userController;