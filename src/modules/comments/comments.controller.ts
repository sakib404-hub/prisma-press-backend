import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { commentService } from "./comments.service";
import sendResponse2 from "../../utility/sendResponse2";
import status from "http-status";
import userService from "../user/user.services";

// Get all comments by a specific author
const getCommentsByAuthor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const authorId = req.params.authorId;

    const allCommentsByAuthor = await commentService.getCommentsByAuthor(authorId as string);

    return sendResponse2(res, {
      success : true,
      statusCode : status.OK,
      message : "All comment by author fetched successfully",
      data : allCommentsByAuthor
    })

  }
);

// Get a single comment
const getSingleComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const commentId = req.params.commentId;

    const comment = await commentService.getSingleComment(commentId as string);

    return sendResponse2(res, {
      success : true,
      statusCode : status.OK,
      message : "Specific comment found successfully!",
      data : comment
    })

  }
);

// Create a comment
const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payLoad = req.body;
    const result = await commentService.createComment(payLoad);

    return sendResponse2(res, {
      success : true,
      statusCode : status.CREATED,
      message : "Comment created Successfully",
      data : result
    })
  }
);

// Update own comment
const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
      const payLoad = req.body;
      const commentId = req.params.commentId;

      const result = await commentService.updateComment(commentId as string, payLoad);

      return sendResponse2(res, {
        success : true,
        statusCode : status.OK,
        message : "Comment updated successfully",
        data : result
      })
  }
);

// Delete own comment
const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

  }
);

// Moderate comment (Admin)
const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

  }
);

export const commentController = {
  getCommentsByAuthor,
  getSingleComment,
  createComment,
  updateComment,
  deleteComment,
  moderateComment,
};