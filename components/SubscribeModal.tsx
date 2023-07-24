'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import { formatPrice, postData } from '@/libs/helpers';
import { Price, ProductWithPrice } from '@/types/stripe';
import { getStripe } from '@/libs/stripeClient';
import Modal from './Modal';
import Button from './Button';
import useSubscribeModal from '@/hooks/useSubscribeModal';

type Props = {
    products: ProductWithPrice[]
};

const SubscribeModal = ({ products }: Props) => {
    const subscribeModal = useSubscribeModal();
    const { user, isLoading, subscription } = useUser();

    const [priceIdLoading, setPriceIdLoading] = useState<string>();

    const onChange = (open: boolean) => {
        if (!open) {
            subscribeModal.onClose();
        }
    }

    const handleCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);

        if (!user) {
            setPriceIdLoading(undefined);

            return toast.error('You must be logged in');
        }

        if (subscription) {
            setPriceIdLoading(undefined);

            return toast.error('You already have an active subscription');
        }

        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { price }
            });

            const stripe = await getStripe();

            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            toast.error((error as Error)?.message);
        } finally {
            setPriceIdLoading(undefined);
        }
    };

    let content = (
        <div className='text-center'>
            No products available
        </div>
    );

    if (products.length) {
        content = (
            <div className='text-center'>
                { 
                    products.map((product, index) => {
                        if (!product.prices?.length) {
                            return (
                                <div key={product.id}>
                                    No prices available
                                </div>
                            )
                        }

                        return product.prices.map(price => (
                            <Button 
                                key={price.id}
                                className={product.prices!.length > 1 && index != product.prices!.length - 1 ? 'mb-4' : ''}
                                disabled={isLoading || price.id === priceIdLoading}
                                onClick={() => handleCheckout(price)}
                            >
                                {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
                            </Button>
                        ))
                    }) 
                }
            </div>
        );
    }

    if (subscription) {
        content = (
            <div className='text-center'>
                You are already subscribed
            </div>
        );
    }

    return (
        <Modal
            title='Subscribe to Spotify Premium'
            description='Listen to music ad-free, offline, and with your screen off.'
            isOpen={subscribeModal.isOpen}
            onChange={onChange}
        >
            { content }
        </Modal>
    );
};

export default SubscribeModal;