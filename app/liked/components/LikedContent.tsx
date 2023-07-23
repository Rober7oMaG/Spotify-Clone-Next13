'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Song } from '@/types/songs';
import { useUser } from '@/hooks/useUser';
import MediaItem from '@/components/MediaItem';
import LikeButton from '@/components/LikeButton';
import useOnPlay from '@/hooks/useOnPlay';

type Props = {
    songs: Song[]
}

const LikedContent = ({ songs }: Props) => {
    const router = useRouter();
    const { user, isLoading } = useUser();
    const onPlay = useOnPlay(songs);

    useEffect(() => {
    if (!user && !isLoading) {
        router.replace('/');
    }
    }, [isLoading, router, user]);

    if (songs.length === 0) {
        return (
            <div className='px-6 text-neutral-400'>
                You have no liked songs
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-y-2 w-full p-6'>
            {
                songs.map((song) => (
                    <div
                        key={song.id}
                        className='flex items-center gap-x-4 w-full'
                    >
                        <div className='flex-1'>
                            <MediaItem 
                                song={song} 
                                onClick={(id: string) => onPlay(id)}
                            />
                        </div>

                        <LikeButton songId={song.id} />
                    </div>
                ))
            }
        </div>
    );
};

export default LikedContent;