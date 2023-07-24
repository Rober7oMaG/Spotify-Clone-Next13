import { Price } from '@/types/stripe';

export const getUrl = () => {
    let url = 
        process.env.NEXT_PUBLIC_SITE_URL ?? 
        process.env.VERCEL_URL ??
        'http://localhost:3000';

    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;

    return url;
};

export const postData = async ({ 
    url, 
    data 
}: { 
    url: string; 
    data?: { price: Price } 
}) => {
    console.log('POST REQUEST:', url, data);

    const response: Response = await fetch(url, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.log('Error in POST:', { url, data, response });

        throw new Error(response.statusText);
    }

    return response.json();
};

export const toDateTime = (secs: number) => {
    const time = new Date('1970-01-01T00:30:00Z');
    time.setSeconds(secs);

    return time;
};

export const formatPrice = (price: Price) => {
    const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency,
        minimumFractionDigits: 0
    }).format((price?.unit_amount || 0) / 100);

    return priceString;
} 