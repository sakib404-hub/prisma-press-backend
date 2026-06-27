import { Router } from "express";
import { commentController } from "./comments.controller";

const router = Router();

router.get("/author/:authorId", commentController.getCommentsByAuthor);

router.get("/:commentId", commentController.getSingleComment);

router.post("/", commentController.createComment);

router.patch("/:commentId", commentController.updateComment);

router.delete("/:commentId", commentController.deleteComment);

router.patch("/:commentId/moderate", commentController.moderateComment);

export const commentRouter = router;