import { prisma } from "../../lib/prisma";
import { AuthPayLoad } from "./auth.interface";
import bcrypt from "bcrypt"


const longinUser = async(payLoad : AuthPayLoad)=>{
    const {email, password} = payLoad;

    const user = await prisma.user.findUniqueOrThrow({
        where : {
            email
        }
    })

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
        throw new Error("Password is Incorrect!");
    }

    return user;
}

const authServices = {
    longinUser
}

export default authServices;