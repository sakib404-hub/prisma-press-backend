import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { postService } from "./post.service";
import sendResponse2 from "../../utility/sendResponse2";
import status from "http-status";
import { Role } from "../../../generated/prisma/enums";

//? getting all the posts
const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const allPosts = await postService.getAllPosts();

    return sendResponse2(res, {
        success: true,
        statusCode: status.OK,
        message: "All post fetched successfully",
        data: allPosts
    })
})

//? getting post states this will be done by the admin himself
const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await postService.getPostStats();

    return sendResponse2(res, {
        success : true,
        statusCode : status.OK,
        message : "Post stats retived successfully!",
        data : result
    })

})

//? getting my post this will be for the authenticated user or the admin
//? this is the get post by Id
const myPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id;
    const posts = await postService.myPost(userId as string);

    return sendResponse2(res, {
        success: true,
        statusCode: status.OK,
        message: "Post Information fetched successfully",
        data: posts
    })

})

//? returns a single post and increments its view counts
const incrementViewCount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
        throw new Error("Post id not found!");
    }

    const result = await postService.incrementViewCount2(postId as string);

    return sendResponse2(res, {
        success: true,
        statusCode: status.OK,
        message: "Your post found successfully!",
        data: result
    })
})

//? creating a post
const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payLoad = req.body;
    const id = req.user?.id;

    const result = await postService.createPost(payLoad, id as string);

    return sendResponse2(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Post Created Successfully",
        data: result
    });
})

//? updating a particular post
const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   
    const userId = req.user?.id;
    const payLoad = req.body;
    const role = req.user?.role === Role.ADMIN ? true : false;
    const postId = req.params.postId;

    await postService.updatePost(postId as string,
        payLoad, userId as string, role
    );

    sendResponse2(res, {
        success : true,
        statusCode : status.OK,
        message : "Post Deleted Successfully!",
    })
})

//? deleting a particular post

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === Role.ADMIN ? true : false;


        const result = await postService.deletePost(postId as string, authorId as string, isAdmin
    );

    sendResponse2(res, {
        success : true,
        statusCode : status.OK,
        message : "Post Deleted Successfully!",
        data : result
    })
})




export const postController = {
    getAllPosts,
    createPost,
    getPostStats,
    myPost,
    incrementViewCount,
    updatePost,
    deletePost
}