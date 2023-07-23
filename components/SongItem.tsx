'use client';

import Image from 'next/image';
import React from 'react';
import useLoadImage from '@/hooks/useLoadImage';
import { Song } from '@/types/songs';
import PlayButton from './PlayButton';

type Props = {
    song: Song;
    onClick: (id: string) => void;
}

const SongItem = ({ song, onClick }: Props) => {
    const imagePath = useLoadImage(song);

    return (
        <div
            className='relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3'
            onClick={() => onClick(song.id)}
        >
            <div className='relative aspect-square w-full h-full rounded-md overflow-hidden'>
                <Image
                    className='object-cover'
                    fill
                    src={imagePath || '/images/liked.png'}
                    alt={song.title}
                />
            </div>

            <div className='flex flex-col items-start w-full pt-4 gap-y-1'>
                <p className='font-semibold truncate w-full'>
                    {song.title}
                </p>

                <p className='text-neutral-400 text-sm pb-4 w-full truncate'>
                    {song.author}
                </p>
            </div>

            <div className='absolute bottom-24 right-5'>
                <PlayButton />
            </div>
        </div>
    );
};

export default SongItem;