import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { postService } from "./post.service";
import sendResponse2 from "../../utility/sendResponse2";
import status from "http-status";

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

    const result = await postService.incrementViewCount(postId as string);

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

})

//? deleting a particular post

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

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