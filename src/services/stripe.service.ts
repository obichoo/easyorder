import Stripe from 'stripe';
import {loadStripe} from "@stripe/stripe-js";

const secretKey = process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY as string;
const stripe = new Stripe(secretKey);
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

class StripeService {
    async createCustomer(email: string, name: string) {

    }

    async createPayment(amount: number, stripeId?: string) {// Récupère le montant du paiement du frontend
        // Créer une session de paiement avec un montant variable
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Total', // Nom générique pour le paiement
                            description: 'Le coût total des produits de votre panier', // Description du paiement
                        },
                        unit_amount: amount, // Montant en centimes (ex: 1000 pour 10 EUR)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://easyorder-gamma.vercel.app/payment/confirmation',
            cancel_url: 'https://easyorder-gamma.vercel.app/payment/failure',
            customer: stripeId
        },{
            apiKey: secretKey
        });

        const stripeRedirect = await stripePromise;
        const { error }: any = await stripeRedirect?.redirectToCheckout({ sessionId: session.id });

        if (error) {
            return { success: false, error }
        } else {
            return { success: true }
        }
    }
}

export default new StripeService();
