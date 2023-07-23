'use client';

import React from 'react';
import usePlayer from '@/hooks/usePlayer';
import useGetSong from '@/hooks/useGetSong';
import useLoadSong from '@/hooks/useLoadSong';
import PlayerContent from './PlayerContent';

type Props = {};

const Player = (props: Props) => {
    const player = usePlayer();
    const { song } = useGetSong(player.activeId);

    const songPath = useLoadSong(song!);

    if (!song || !songPath || !player.activeId) {
        return null;
    }

    return (
        <div className='fixed bottom-0 bg-black w-full py-2 h-[80px] px-4'>
            <PlayerContent
                key={songPath}
                song={song}
                songPath={songPath}
            />
        </div>
    );
};

export default Player;