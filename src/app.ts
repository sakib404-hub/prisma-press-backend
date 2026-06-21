import cookieParser from "cookie-parser";
import cors from "cors"
import express, { Application, Request, Response } from "express";
import config from "./config/dotenv";
import { prisma } from "./lib/prisma";
import HttpStatus from "http-status";
import bcrypt from "bcrypt" 

const app: Application = express();


//? middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

//? creating a first route for testing the server
app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello, World!' });
})


//? creating the apis
app.post('/api/users/registratation', async (req: Request, res: Response) => {
    const {email, password, name, profilePhoto} = req.body;
    console.log(email, password, name);

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

    res.status(HttpStatus.CREATED).json({
        success : true,
        statusCode : HttpStatus.CREATED,
        message: "User Registratation SAuccessfull",
        data : {
            user
        }

    })
})

export default app;
