import { CommentStaus } from "../../../generated/prisma/enums";

export interface ICommentPayLoad {
    content : string;
    authorId : string;
    postId : string;
    status : CommentStaus
}