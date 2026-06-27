import { Router } from "express";
import { commentController } from "./comments.controller";
import auth from "../../Middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

//? getting all the comments written by the user
router.get("/author/:authorId", commentController.getCommentsByAuthor);

router.get("/:commentId", commentController.getSingleComment);

//? posting a comment on a post
router.post("/", commentController.createComment);

router.patch("/:commentId",auth(), commentController.updateComment);

router.delete("/:commentId",auth(Role.USER), commentController.deleteComment);

router.patch("/:commentId/moderate", commentController.moderateComment);

export const commentRouter = router;