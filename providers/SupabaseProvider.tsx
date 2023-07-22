'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

type Props = {
    children: React.ReactNode;
}

const SupabaseProvider = ({ children }: Props) => {
    const [supabaseClient, setSupabaseClient] = useState(() => createClientComponentClient<Database>());

    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
            { children }
        </SessionContextProvider>
    );
};

export default SupabaseProvider;
