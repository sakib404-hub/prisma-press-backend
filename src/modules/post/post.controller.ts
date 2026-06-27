import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";

//? getting all the posts
const getAllPosts = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

})

//? getting post states this will be done by the admin himself
const getPostStats = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

})

//? getting my post this will be for the authenticated user or the admin
const myPost = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

})

//? returns a single post and increments its view counts
const incrementViewCount = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

})

//? creating a post
const createPost = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

})

//? updating a particular post
const updatePost = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

})

//? deleting a particular post

const deletePost = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{

})




export const postController ={
    getAllPosts,
    createPost,
    getPostStats,
    myPost,
    incrementViewCount,
    updatePost,
    deletePost
}