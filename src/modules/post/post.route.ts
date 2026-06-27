import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../Middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

//? getting all the posts
router.get('/', postController.getAllPosts);

//? this is for the admin
router.get('/stats', auth(Role.ADMIN), postController.getPostStats);

//? finding my posts only
router.get('/my-posts', auth(Role.ADMIN, Role.USER), postController.myPost);

//? getting the post by id
router.get('/:postId', postController.incrementViewCount);

router.post('/', auth(Role.USER, Role.ADMIN, Role.AUTHOR), postController.createPost);

router.patch('/:postId', auth(Role.USER, Role.ADMIN), postController.updatePost);

router.delete('/:postId', auth(Role.USER, Role.ADMIN), postController.deletePost);

export const postRouter = router;