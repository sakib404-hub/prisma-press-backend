import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";

// Get all comments by a specific author
const getCommentsByAuthor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

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