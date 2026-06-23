import config from "../../config/dotenv";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt" 
import { PayLoad } from "./user.interface";



const createUserIntoDB = async(payload : PayLoad)=>{
        const {email, password, name, profilePhoto} = payload;

    //? if user exist with same email 
    const isUserExist = await prisma.user.findUnique({
        where : {
            email
        }
    })

    if(isUserExist){
        throw new Error("User With Email Already Exist");
    }

    const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);


    //? creating the user
    const NewUser = await prisma.user.create({
        data : {
            name, 
            email,
            password : hashedPassword,
        }
    })

    //? creating the profile for the user
  await prisma.profile.create({
        data : {
            userId : NewUser.id,
            profilePhoto
        }
    })

    const user = await prisma.user.findUnique({
        where : {
            id : NewUser.id,
            email : NewUser.email || email
        },
        include : {
            profile : true
        },
        omit : {
            password : true
        },
    })

    return user;
}

const getAllUsersFromDB = async()=>{
    const users = await prisma.user.findMany({
        include : {
            profile : true
        }
    });
    return users;
}


const userService = {
    createUserIntoDB,
    getAllUsersFromDB
}

export default userService;