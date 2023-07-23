'use client';

import React from 'react';
import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import useUploadModal from '@/hooks/useUploadModal';
import { Song } from '@/types/songs';
import MediaItem from './MediaItem';
import useOnPlay from '@/hooks/useOnPlay';

type Props = {
    songs: Song[];
}

const Library = ({ songs }: Props) => {
    const authModal = useAuthModal();
    const uploadModal = useUploadModal();
    const onPlay = useOnPlay(songs);
    const { user } = useUser();

    const onClick = () => {
        if (!user) {
            return authModal.onOpen();
        }

        // TODO: Check for subscription

        return uploadModal.onOpen();
    }

    return (
        <div className='flex flex-col'>
            <div className='flex items-center justify-between px-5 py-4'>
                <div className='inline-flex items-center gap-x-2'>
                    <TbPlaylist className='text-neutral-400' size={26} />
                    <p className='text-neutral-400 font-medium text-md'>Your Library</p>
                </div>

                <AiOutlinePlus 
                    className='text-neutral-400 cursor-pointer hover:text-white transition' 
                    size={20} 
                    onClick={onClick} 
                />
            </div>

            <div className='flex flex-col gap-y-2 mt-4 px-3'>
                {
                    songs.map(song => (
                        <MediaItem 
                            key={song.title}
                            song={song}
                            onClick={(id: string) => onPlay(id)}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Library;