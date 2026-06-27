import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../Middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.get('/', postController.getAllPosts);

router.get('/stats', auth(Role.ADMIN), postController.getPostStats);

router.get('/my-posts', auth(Role.ADMIN, Role.USER), postController.myPost);

router.get('/:postId', postController.incrementViewCount);

router.post('/', auth(Role.USER, Role.ADMIN), postController.createPost);

router.patch('/:postId', auth(Role.USER, Role.ADMIN), postController.updatePost);

router.delete('/:postId', auth(Role.USER, Role.ADMIN), postController.deletePost);

export const postRouter = router;