'use client';

import React from 'react';
import { BounceLoader } from 'react-spinners';

type Props = {};

const Loading = (props: Props) => {
    return (
        <div className='h-full flex items-center justify-center'>
            <BounceLoader color='#22C55E' size={40} />
        </div>
    );
};

export default Loading;