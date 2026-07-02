import Stripe from "stripe";
import stripe from "../../lib/strip";
import { prisma } from "../../lib/prisma";
import { SubscriptionStatus } from "../../../generated/prisma/enums";

export const getPeriodEndTime = (payLoad: Stripe.Subscription) => {
    const currentPeriodEndInMiliSeconds = payLoad.items.data[0]?.current_period_end!;

    const cureentPeriodEnds = new Date(currentPeriodEndInMiliSeconds * 1000);

    return cureentPeriodEnds;

}

export const handleCheckOutSessionComplete = async (session: Stripe.Checkout.Session) => {
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

export const handleChangeSubscriptionChange = async(payLoad: Stripe.Subscription) => {
    const stripeSubscriptionId = payLoad.id;

    const status =
        (payLoad.status === "active" || payLoad.status === "trialing") ?
            SubscriptionStatus.ACTIVE :
            payLoad.status === "canceled" ? SubscriptionStatus.CANCELED : SubscriptionStatus.EXPIRED;

    const currentPeriodEnd = getPeriodEndTime(payLoad);

    const isSubscriptionExists = await prisma.subscription.findUnique({
        where : {
            id : stripeSubscriptionId
        }
    })

    if(!isSubscriptionExists){
        console.log(`Webhook : No subscription found with id ${stripeSubscriptionId}`);
        return;
    }

    await prisma.subscription.update({
        where : {
            id : stripeSubscriptionId
        },
        data : {
            status,
            current_period_end : currentPeriodEnd
        }
    });


}