import { CommentStaus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayLoad, IUpdatePostPayLoad } from "./post.interface";

const getAllPosts = async () => {
    const result = await prisma.post.findMany({
        //? filtering with the and operators
        // where: {
        //     AND: [
        //         {
        //             status: PostStatus.PUBLISHED
        //         },
        //         {
        //             title: "Building Secure APIs with JWT"
        //         },
        //         {
        //             tags: {
        //                 equals: [
        //                     "JWT",
        //                     "Authentication",
        //                     "Security"
        //                 ]
        //             }
        //         }
        //     ]
        // },


        //? searching or partital matching

        // where : {
        //     //? this becomes and means that both condition had to be mathced for finding a post
        //     title : {
        //         contains : "with",
        //         mode : "insensitive"
        //     },
        //     content : {
        //         contains : "tokens",
        //         mode : "insensitive"
        //     }
        // },


        //? for avoiding such thing we can do this
        //? this becomes or means that if one can matched you wil fetch the data
        // where : {
        //     OR : [
        //         {
        //             title : {
        //                 contains : "secure",
        //                 mode : "insensitive"
        //             },
        //         },
        //         {
        //             content : {
        //                 contains : "prisma",
        //                 mode : "insensitive"
        //             }
        //         }
        //     ]
        // },

        take : 1, //? take in express is known as the limit how many data we will show

        skip : 1,
        //? what number of page i want to skip 
        //? page  : (skip + 1) this page i am showing to everyone

        orderBy : {
            createdAt : "desc",
            title : "asc"
        }




        // include: {
        //     author: {
        //         omit: {
        //             password: true
        //         }
        //     },
        //     comments: true
        // }
    });
    return result;
};

const getPostStats = async () => {

    const transactionResult = await prisma.$transaction(async (tx) => {

        const [
            totalPosts,
            publishedPosts,
            draftPosts,
            archivedPosts,
            totalComments,
            approvedComments,
            rejectedComments,
            totalViews,
        ] = await Promise.all([
            await tx.post.count(),

            await tx.post.count({
                where: {
                    status: PostStatus.PUBLISHED
                }
            }),

            await tx.post.count({
                where: {
                    status: PostStatus.DRAFT
                }
            }),

            await tx.post.count({
                where: {
                    status: PostStatus.ARCHIVED
                }
            }),

            await tx.comment.count(),

            await tx.comment.count({
                where: {
                    status: CommentStaus.APPROVED
                }
            }),
            await tx.comment.count({
                where: {
                    status: CommentStaus.REJECT
                }
            }),
            await tx.post.aggregate({
                _sum: {
                    views: true
                }
            })

        ]);

        return {
            totalPosts,
            publishedPosts,
            draftPosts,
            archivedPosts,
            totalComments,
            approvedComments,
            rejectedComments,
            totalViews,
        }
    })

    return transactionResult;

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


const incrementViewCount2 = async (postId: string) => {

    const transactionResult = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        });

        const post = await tx.post.findUnique({
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

    });

    return transactionResult;
}

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
    incrementViewCount2
};