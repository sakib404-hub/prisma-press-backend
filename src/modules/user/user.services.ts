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
    // const NewUser = await prisma.user.create({
    //     data : {
    //         name, 
    //         email,
    //         password : hashedPassword,
    //     }
    // });


    //? we can also create profile while creating the user like below
    const NewUser1 = await prisma.user.create({
        data : {
            name,
            email,
            password : hashedPassword,
            profile : {
                create : {
                    profilePhoto
                }
            }
        }
    })

    //? creating the profile for the user
//   await prisma.profile.create({
//         data : {
//             userId : NewUser.id,
//             profilePhoto
//         }
//     })

    const user = await prisma.user.findUnique({
        where : {
            id : NewUser1.id,
            email : NewUser1.email || email
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


const getMyProfileFromDB = async(id : string)=>{
    const user = await prisma.user.findUnique({
        where :{
            id : id
        },
        omit : {
            password : true
        },
        include : {
            profile : true
        }
    })

    if(!user){
        throw new Error("User Does not exist");
    }

    return user;
}


const updateMYProfileInDB = async(userId : string, payLoad : any)=>{
    const {name, email, profilePhoto, bio} = payLoad;

    const updatedUser = await prisma.user.update({
        where : {
            id : userId
        },
        data : {
            name,
            email,
            profile : {
                update : {
                    profilePhoto,
                    bio
                }
            }
        },
        omit : {
            password : true,
        },
        include : {
            profile : true
        }
    });

    return updatedUser;
}


const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getMyProfileFromDB,
    updateMYProfileInDB
}

export default userService;