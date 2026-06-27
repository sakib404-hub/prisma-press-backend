import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { commentService } from "./comments.service";
import sendResponse2 from "../../utility/sendResponse2";
import status from "http-status";

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

  }
);

// Create a comment
const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

  }
);

// Update own comment
const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

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