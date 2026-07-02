import cookieParser from "cookie-parser";
import cors from "cors"
import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import config from "./config/dotenv";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.routes";
import { postRouter } from "./modules/post/post.route";
import { commentRouter } from "./modules/comments/comments.route";
import { notFound } from "./Middlewares/notfound";
import { globalErrorHandler } from "./Middlewares/globalErrorHandler";
import { subscriptionRouter } from "./modules/subscription/subscription.route";
import stripe from "./lib/strip";

const app: Application = express();

const endpointSecret = config.stripe_webhook_secret;

// app.post('/api/subscription/webhook', express.raw({
//     type : "application/json"
// }), (request, response) => {
//   let event = request.body;
//   console.log(event, "this is the stripe event");
//   console.log(request.headers,"this is the header!");

//   // Only verify the event if you have an endpoint secret defined.
//   // Otherwise use the basic event deserialized with JSON.parse
//   if (endpointSecret) {
//     // Get the signature sent by Stripe

//     //? converting buffer to a valid object
//     const signature = request.headers['stripe-signature'];
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.body,
//         signature!,
//         endpointSecret
//       );
//     } catch (err : any) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return response.sendStatus(400).json({
//         message : err.message
//       });
//     }
//   }

//   console.log(event ,"This is event after the try bloack!");

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });


//? appling the express.raw middleware for the webhook route
app.use("/api/subscription/webhook", express.raw({
  type : "application/json"
}));


//? middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

//? creating a first route for testing the server
app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello, World!' });
})


//? creating the apis
app.use('/api/user', userRouter);

app.use('/api/auth', authRouter);

app.use('/api/posts', postRouter);

app.use('/api/comments', commentRouter);

app.use('/api/subscription', subscriptionRouter);


//? middleware for global error handler and not found route
app.use(notFound);
app.use(globalErrorHandler);

export default app;
