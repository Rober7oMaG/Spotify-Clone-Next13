import { NextResponse, } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/libs/stripe';
import {
    upsertProduct,
    upsertPrice,
    manageSubscriptionStatusChange
} from '@/libs/supabaseAdmin';

const relevantEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);

export async function POST(request: Request) {
    const body = await request.text();
    const signature = request.headers.get('Stripe-Signature');

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
        if (!signature || !webhookSecret) {
            return;
        }

        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
        console.log(`Error: ${error.message}`);

        return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
    }

    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                case 'product.created':
                case 'product.updated':
                    await upsertProduct(event.data.object as Stripe.Product);
                    break;

                case 'price.created':
                case 'price.updated':
                    await upsertPrice(event.data.object as Stripe.Price);
                    break;

                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    if (checkoutSession.mode === 'subscription') {
                        const subscriptionId = checkoutSession.subscription;
                        await manageSubscriptionStatusChange(
                            subscriptionId as string,
                            checkoutSession.customer as string,
                            true
                        );
                    }
                    break;

                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;

                    await manageSubscriptionStatusChange(
                        subscription.id, 
                        subscription.customer as string,
                        event.type === 'customer.subscription.created'
                    );
                    break;

                default:
                    throw new Error(`Unhandled event type: ${event.type}`);
            }
        } catch (error: any) {
            console.log(`Error: ${error.message}`);

            return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
