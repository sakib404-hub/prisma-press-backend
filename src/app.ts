import cookieParser from "cookie-parser";
import cors from "cors"
import express, { Application, Request, Response } from "express";
import config from "./config/dotenv";

import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.routes";
import { postRouter } from "./modules/post/post.route";
import { commentRouter } from "./modules/comments/comments.route";

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

export default app;
