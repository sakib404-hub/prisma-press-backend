import { CommentStaus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayLoad, IUpdatePostPayLoad } from "./post.interface";

const getAllPosts = async () => {
    const result = await prisma.post.findMany({
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    });
    return result;
};

const getPostStats = async () => {

};

//? this is the getPostById
const myPost = async (authorId: string) => {
    const posts = await prisma.post.findMany({
        where: {
            authorId: authorId
        },
        orderBy: {
            createdAt: "asc"
        },
        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },
            //? counting the comments in the posts
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })

    return posts;
};

//? gettingg the post by id and incrementing coutn view
const incrementViewCount = async (postId: string) => {

    await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            views: {
                increment: 1
            }
        }
    })


    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: {
            comments: {
                where: {
                    status: CommentStaus.APPROVED
                },
                orderBy: {
                    createdAt: "desc"
                }
            },
            author: {
                omit: {
                    password: true
                }
            },
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })

    return post;
};

const createPost = async (payLoad: ICreatePostPayLoad, userId: string) => {

    const result = await prisma.post.create({
        data: {
            ...payLoad,
            authorId: userId
        }
    })

    return result;

};


const updatePost = async (postId: string, payLoad: IUpdatePostPayLoad,
    authorId: string, isAdmin: boolean
) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })

    if (!post) {
        throw new Error("Post doesn't exist!");
    }

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You don't have the permission to update this post, you are not the owner of this post");
    }

    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: payLoad,
        include: {
            author: {
                omit: {
                    password: true
                }
            }
        }
    })

    return updatedPost;

};

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: {
            author: {
                omit: {
                    password: true
                }
            }
        }
    });

    if (!post) {
        throw new Error("Post Does not exist");
    }

    if (!isAdmin && post?.authorId !== authorId) {
        throw new Error("Forbidden,You don't have the permission to delete this post!");
    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    })

    return null;

};

export const postService = {
    getAllPosts,
    getPostStats,
    myPost,
    incrementViewCount,
    createPost,
    updatePost,
    deletePost,
};