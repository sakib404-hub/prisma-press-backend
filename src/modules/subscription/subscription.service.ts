import config from "../../config/dotenv";
import { prisma } from "../../lib/prisma";
import stripe from "../../lib/strip";

const createCheckhOutSession = async (userId: string) => {

    const transactionResult = await prisma.$transaction(async (tx) => {

        //? checking if the user exists or not
        const user = await tx.user.findUnique({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }
        })

        if (!user) {
            throw new Error("User not found");
        }

        //? getting the customer id for the old subscriber
        let stripeCustomerId = user.subscription?.stripeCustomerId

        //? if customer id doesn't exits therefore we will create a customer id
        if (!stripeCustomerId) {
            //? new subscriber 
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id
                }
            })

            stripeCustomerId = customer.id
        }


        const session = await stripe.checkout.sessions.create({
            line_items : [
                {
                    price : config.stripe_price_id,
                    quantity : 1
                }
            ],
            mode : "subscription",
            customer : stripeCustomerId,
            payment_method_types : ["card"],
            success_url : `${config.front_end_url}/premium?success=true`,
            cancel_url : `${config.front_end_url}/paymentFailed?success=false`,
            metadata : {
                userId : user.id
            }
        })
        return session.url;
    })

    return {
        paymentUrl : transactionResult
    };
};


const weebHookHandler = ()=>{

}

export const subsbscriptionService = {
    createCheckhOutSession,
    weebHookHandler
}