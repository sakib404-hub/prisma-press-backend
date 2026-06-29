import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode ;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";
  let errorDetails = err.stack;

  // Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = status.BAD_REQUEST;
    errorMessage =
      "Invalid input. You have provided incorrect field types or missing required fields.";
  }

  // Known Request Error (Unique constraint, Foreign key, Record not found, etc.)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = status.BAD_REQUEST;

    switch (err.code) {
      case "P2002":
        errorMessage = `Unique constraint failed on field(s): ${(
          err.meta?.target as string[]
        )?.join(", ")}`;
        break;

      case "P2003":
        errorMessage = "Foreign key constraint failed.";
        break;

      case "P2025":
        statusCode = status.NOT_FOUND;
        errorMessage = "Record not found.";
        break;

      case "P2014":
        errorMessage = "Invalid relation between records.";
        break;

      case "P2016":
        errorMessage = "Query interpretation error.";
        break;

      case "P2021":
        errorMessage = "Table does not exist in the database.";
        break;

      case "P2022":
        errorMessage = "Column does not exist in the database.";
        break;

      default:
        errorMessage = err.message;
    }
  }

  // Unknown Request Error
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    errorMessage = "An unknown database error occurred.";
  }

  // Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    errorMessage = "Failed to connect to the database.";
  }

  // Rust Panic Error
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    errorMessage =
      "Prisma engine crashed unexpectedly. Please restart the server.";
  }

  return res.status(statusCode || status.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode,
    name: errorName,
    message: errorMessage,
    error: process.env.NODE_ENV === "development" ? errorDetails : undefined,
  });
};