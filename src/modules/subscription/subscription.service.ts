import Stripe from "stripe";
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

            break;
        case 'customer.subscription.deleted':
            //? occures when a customer subscription ends
            const paymentMethod = event.data.object;

            break;
        default:

            console.log(`No event matched - ${event.type}.`);
            break;
    }
}

const getPeriodEndTime = (payLoad: Stripe.Subscription) => {
    const currentPeriodEndInMiliSeconds = payLoad.items.data[0]?.current_period_end!;

    const cureentPeriodEnds = new Date(currentPeriodEndInMiliSeconds * 1000);

    return cureentPeriodEnds;

}

const handleCheckOutSessionComplete = async (session: Stripe.Checkout.Session) => {
    const userId = session.metadata?.userId as string;

    //? getting the stripe customer id
    const stripeCustomerId = session.customer as string;

    //? getting the stripe subscriptionId
    const stripeSubscriptionId = session.subscription as string;

    if (!userId || !stripeSubscriptionId || !stripeCustomerId) {
        throw new Error("Webhook failed!");
    }

    //? stripe subscription information getting
    const subcriptionInformation = await stripe.subscriptions.retrieve(stripeSubscriptionId as string);

    // console.log("subcription information",subcriptionInformation.items.data[0]);

    //? getting the subscription end time

    const cureentPeriodEnds = getPeriodEndTime(subcriptionInformation);

    //? inserting into the database if not exist if exist updating it

    await prisma.subscription.upsert({
        where: {
            userId
        },
        create: {
            userId,
            stripeCustomerId,
            stripeSubscriptionId: stripeSubscriptionId,
            current_period_end: cureentPeriodEnds
        },
        update: {
            stripeCustomerId,
            stripeSubscriptionId: stripeSubscriptionId,
            current_period_end: cureentPeriodEnds
        }
    })

}

export const subsbscriptionService = {
    createCheckhOutSession,
    weebHookHandler
}