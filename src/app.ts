import cookieParser from "cookie-parser";
import cors from "cors"
import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import config from "./config/dotenv";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.routes";
import { postRouter } from "./modules/post/post.route";
import { commentRouter } from "./modules/comments/comments.route";
import status from "http-status";
import { notFound } from "./Middlewares/notfound";
import sendResponse2 from "./utility/sendResponse2";
import { globalErrorHandler } from "./Middlewares/globalErrorHandler";

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
app.use('/api/user', userRouter);

app.use('/api/auth', authRouter);

app.use('/api/posts', postRouter);

app.use('/api/comments', commentRouter);


//? middleware for global error handler and not found route
app.use(notFound);
app.use(globalErrorHandler);

export default app;
