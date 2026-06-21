import cookieParser from "cookie-parser";
import cors from "cors"
import express, { Application, Request, Response }from "express";
import config from "./config/dotenv";

const app : Application = express();


//? middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

//? creating a first route for testing the server
app.get('/', (req : Request, res : Response)=>{
    res.status(200).json({message: 'Hello, World!'});
})

export default app;
