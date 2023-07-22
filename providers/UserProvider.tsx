'use client';

import React from 'react';
import { UserContextProvider } from '@/hooks/useUser';

type Props = {
    children: React.ReactNode;
}

const UserProvider = ({ children }: Props) => {
    return (
        <UserContextProvider>
            { children }
        </UserContextProvider>
    );
};

export default UserProvider;