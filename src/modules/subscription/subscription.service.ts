import Stripe from "stripe";
import config from "../../config/dotenv";
import { prisma } from "../../lib/prisma";
import stripe from "../../lib/strip";
import { handleChangeSubscriptionChange, handleCheckOutSessionComplete } from "./subscription.utils";
import { Role, SubscriptionStatus } from "../../../generated/prisma/enums";

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
            line_items: [
                {
                    price: config.stripe_price_id,
                    quantity: 1
                }
            ],
            mode: "subscription",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.front_end_url}/premium?success=true`,
            cancel_url: `${config.front_end_url}/paymentFailed?success=false`,
            metadata: {
                userId: user.id
            }
        })
        return session.url;
    })

    return {
        paymentUrl: transactionResult
    };
};


const weebHookHandler = async (payLoad: Buffer, signature: string) => {
    const endPointSecret = config.stripe_webhook_secret;
    const event = stripe.webhooks.constructEvent(payLoad, signature, endPointSecret);


    switch (event.type) {
        case 'checkout.session.completed':
            //? occures when a payment session is completed successfully
            const session: Stripe.Checkout.Session = event.data.object;

            handleCheckOutSessionComplete(session);

            break;
        case 'customer.subscription.updated':
            //? occures when a subscription is updated from one plan to another or free to premium 
            await handleChangeSubscriptionChange(event.data.object)

            break;
        case 'customer.subscription.deleted':
            //? occures when a customer subscription ends
             await handleChangeSubscriptionChange(event.data.object)

            break;
        default:

            console.log(`No event matched - ${event.type}.`);
            break;
    }
}

const getSubscriptionStatus = async(userId : string)=>{
    const isSubscriptionExists = await prisma.subscription.findUnique({
        where : {
            userId
        }
    });

    const isActive = isSubscriptionExists?.status === SubscriptionStatus.ACTIVE && isSubscriptionExists.current_period_end && new Date(isSubscriptionExists.current_period_end) > new Date();

    return {
        status : isSubscriptionExists?.status,
        isSubscribed : isActive,
        currentPeriodEnd : isSubscriptionExists?.current_period_end

    }
}

export const subsbscriptionService = {
    createCheckhOutSession,
    weebHookHandler,
    getSubscriptionStatus
}