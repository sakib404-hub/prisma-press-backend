import { prisma } from "../../lib/prisma";
import { ICommentPayLoad } from "./comments.interface";

const getCommentsByAuthor = async (authordId: string) => {
  const allCommentsByAuthor = await prisma.$transaction(async (tx) => {
    const allCommentsByauthor = await tx.comment.findMany({
      where: {
        authorId: authordId
      }
    })
    return allCommentsByauthor;
  })

  return allCommentsByAuthor;
};

const getSingleComment = async () => {
  
};

const createComment = async (payLoad : ICommentPayLoad) => {
  const creatingComment = await prisma.$transaction(async(tx)=>{
    const comment = await tx.comment.create({
        data : payLoad
    })
    return comment;
  })
  return creatingComment;
};

const updateComment = async () => {

};

const deleteComment = async () => {

};

const moderateComment = async () => {

};

export const commentService = {
  getCommentsByAuthor,
  getSingleComment,
  createComment,
  updateComment,
  deleteComment,
  moderateComment,
};