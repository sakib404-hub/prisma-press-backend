import { prisma } from "../../lib/prisma";
import { ICreatePostPayLoad } from "./post.interface";

const getAllPosts = async () => {
    const result = await prisma.post.findMany({
        include : {
            author : {
                omit : {
                    password : true
                }
            },
            comments : true
        }
    });
    return result;
};

const getPostStats = async () => {

};

//? this is the getPostById
const myPost = async (authorId : string) => {
    const posts = await prisma.post.findMany({
        where : {
            authorId : authorId
        },
        orderBy : {
            createdAt : "asc"
        },
        include : {
            comments : true,
            author : {
                omit : {
                    password : true
                }
            },
            //? counting the comments in the posts
            _count : {
                select  : {
                    comments : true
                }
            }
        }
    })

    return posts;
};

//? gettingg the post by id and incrementing coutn view
const incrementViewCount = async (postId : string) => {
        const post = await prisma.post.findUnique({
        where : {
            id : postId
        },
        include : {
            comments : true,
            author : {
                omit : {
                    password : true
                }
            }
        }
    })

    if(!post){
        throw new Error("Post doesn't exist");
    }

    const updatedPost = await prisma.post.update({
        where : {
            id : postId
        },
        data : {
            views : {
                increment : 1
            }
        }
    })

    return updatedPost;
};

const createPost = async (payLoad : ICreatePostPayLoad, userId : string) => {

    const result = await prisma.post.create({
        data : {
            ...payLoad,
            authorId : userId
        }
    })

    return result;

};

const updatePost = async () => {

};

const deletePost = async () => {

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