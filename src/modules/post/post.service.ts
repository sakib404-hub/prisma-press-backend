import { CommentStaus, PostStatus } from "../../../generated/prisma/enums";
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

    const transactionResult = await prisma.$transaction(async (tx) => {
        const totalPosts = await tx.post.count();
        const totalPublishedPost = await tx.post.count({
            where: {
                status: PostStatus.PUBLISHED
            }
        });

        const totalDraftPost = await tx.post.count({
            where: {
                status: PostStatus.DRAFT
            }
        });

        const totalarchivedPost = await tx.post.count({
            where: {
                status: PostStatus.ARCHIVED
            }
        });

        const totalComments = await tx.comment.count();
        const totalApprovedComment = await tx.comment.count({
            where : {
                status : CommentStaus.APPROVED
            }
        });
        const totalRejectedComment  = await tx.comment.count({
            where : {
                status : CommentStaus.REJECT
            }
        });

        //? we can do this but it is not a good approach
        // const allPosts = await tx.post.findMany();

        // let totalPostViews = 0;
        // allPosts.forEach((p)=>{
        //     totalPostViews += p.views;
        // })

        //? for this we will follow aggregation
        const totalPostViwes = await tx.post.aggregate({
            _sum : {
                views : true
            }
        })

        return {
            totalPosts,
            totalDraftPost,
            totalPublishedPost,
            totalarchivedPost,
            totalComments, 
            totalApprovedComment,
            totalRejectedComment,
            totalPostViwes
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