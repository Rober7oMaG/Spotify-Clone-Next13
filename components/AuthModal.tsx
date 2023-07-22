'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import Modal from './Modal';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import useAuthModal from '@/hooks/useAuthModal';

type Props = {};

const AuthModal = (props: Props) => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const { isOpen, onClose } = useAuthModal();

    useEffect(() => {
        if (session) {
            router.refresh();
            onClose();
        }
      }, [session, router, onClose]);

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Modal
            title='Welcome back'
            description='Sign in to your account to continue'
            isOpen={isOpen}
            onChange={onChange}
        >
            <Auth
                supabaseClient={supabaseClient}
                providers={['google', 'facebook', 'github']}
                magicLink
                theme='dark'
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: '#404040',
                                brandAccent: '#22C55E'
                            }
                        }
                    }
                }}
            />
        </Modal>
    );
};

export default AuthModal;