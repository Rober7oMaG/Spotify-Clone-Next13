import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '@/libs/stripe';
import { getUrl } from '@/libs/helpers';
import { getOrCreateCustomer } from '@/libs/supabaseAdmin';

export async function POST() {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Error while fetching user.');
        }

        const customer = await getOrCreateCustomer({
            uuid: user?.id || '',
            email: user?.email || '',
        });

        if (!customer) {
            throw new Error('Error while fetching customer.');
        }

        const { url } = await stripe.billingPortal.sessions.create({
            customer,
            return_url: `${getUrl()}/account`,
        });

        return NextResponse.json({ url });
    } catch (error) {
        console.log(error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}