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

const getSingleComment = async (commentId : string) => {

  const comment = await prisma.comment.findUniqueOrThrow({
    where : {
      id : commentId
    }
  })

  return comment;

};

const createComment = async (payLoad : ICommentPayLoad) => {
  const creatingComment = await prisma.$transaction(async(tx)=>{
    
    //? checking if the post exist or not
    const post = await tx.post.findUnique({
      where : {
        id : payLoad.postId
      },
      select : {
        id : true
      }
    });

    if(!post){
      throw new Error("Post does not exist!");
    }

    const comment = await tx.comment.create({
        data : payLoad
    })
    return comment;
  })
  return creatingComment;
};

const updateComment = async (commentId : string, payLoad : ICommentPayLoad) => {  
  
  const updatdComment = await prisma.comment.update({
    where : {
      id : commentId
    },
    data : payLoad
  })

  return updatdComment;

};

const deleteComment = async (commentId : string) => {
  await prisma.comment.delete({
    where : {
      id : commentId
    }
  })
  return null;
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