'use client';

import Button from '@/components/Button';
import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import { postData } from '@/libs/helpers';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type Props = {};

const AccountContent = (props: Props) => {
    const router = useRouter();
    const subscribeModal = useSubscribeModal();
    const { user, isLoading, subscription } = useUser();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, router, user]);

    const redirectToCustomerPortal = async () => {
        setLoading(true);

        try {
            const { url, error } = await postData({
                url: '/api/create-portal-link',
            });

            window.location.assign(url);
        } catch (error) {
            if (error) {
                toast.error((error as Error).message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='mb-7 px-6'>
            {
                !subscription && (
                    <div className='flex flex-col gap-y-4'>
                        <p>You have no active subscription</p>

                        <Button
                            className='w-[300px]'
                            onClick={subscribeModal.onOpen}
                        >
                            Subscribe
                        </Button>
                    </div>
                )
            }

            {
                subscription && (
                    <div className='flex flex-col gap-y-4'>
                        <p>You have an active <b>{subscription?.prices?.products?.name}</b> subscription</p>

                        <Button
                            className='w-[300px]'
                            disabled={loading || isLoading}
                            onClick={redirectToCustomerPortal}
                        >
                            Open Customer Portal
                        </Button>
                    </div>
                )
            }
        </div>
    );
};

export default AccountContent;