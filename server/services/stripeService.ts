import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não definido nas variáveis de ambiente');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

export async function createPaymentIntent(amount: number, currency = 'brl') {
  return stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['card'],
  });
}

export async function retrievePaymentIntent(id: string) {
  return stripe.paymentIntents.retrieve(id);
}
