import { prisma } from "../../lib/prisma";
import { ICreatePostPayLoad } from "./post.interface";

const getAllPosts = async () => {

};

const getPostStats = async () => {

};

const myPost = async () => {

};

const incrementViewCount = async () => {

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