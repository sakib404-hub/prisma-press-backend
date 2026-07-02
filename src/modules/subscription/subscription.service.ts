import { prisma } from "../../lib/prisma";

const createCheckhOutSession = async(userId : string) =>{

    const transactionResult = await prisma.$transaction(async(tx)=>{

        //? checking if the user exists or not
        const user = await tx.user.findUnique({
            where : {
                id : userId
            },
            include : {
                subscription : true
            }
        })

        if(!user){
            throw new Error("User not found");
        }

        // let stripeCustomerId = user.subscription. 


    })

    return transactionResult;
};

export const subsbscriptionService = {
    createCheckhOutSession
}