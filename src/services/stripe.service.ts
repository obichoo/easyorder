import Stripe from 'stripe';
import {loadStripe} from "@stripe/stripe-js";


const secretKey = process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY as string;
const stripe = new Stripe(secretKey);

class StripeService {
    async createPayment(amount: number, stripeId?: string) {
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
            customer: stripeId,
            ui_mode: 'embedded',
            redirect_on_completion: 'never',
        },{
            apiKey: secretKey
        });

        return session
    }

    async createCustomerSession(customerId: string) {
        const customerSession = await stripe.customerSessions.create({
            customer: customerId,
            components: {
                pricing_table: {
                    enabled: true,
                },
            },
        });

        console.log(customerSession)
        return customerSession
    }
}

export default new StripeService();
