import Stripe from "stripe";
import config from "../config/dotenv";


const stripe = new Stripe(config.stripe_secret_key);

export default stripe;