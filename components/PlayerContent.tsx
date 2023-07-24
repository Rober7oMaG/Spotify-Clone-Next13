'use client';

import React, { useEffect, useState } from 'react';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';

/* eslint-disable */
// @ts-ignore
import useSound from 'use-sound';
/* eslint-enable */

import usePlayer from '@/hooks/usePlayer';
import { Song } from '@/types/songs';
import MediaItem from './MediaItem';
import LikeButton from './LikeButton';
import Slider from './Slider';

type Props = {
    song: Song,
    songPath: string
};

const PlayerContent = ({ song, songPath }: Props) => {
    const player = usePlayer();

    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const [play, { pause, sound }] = useSound(
        songPath, {
            volume,
            onplay: () => setIsPlaying(true),
            onpause: () => setIsPlaying(false),
            onend: () => {
                setIsPlaying(false);
                onPlayNext();
            },
            format: ['mp3']
        },
    );

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

        useEffect(() => {
        sound?.play();

        return () => {
            sound?.unload();
        }
        }, [sound]);

    const handlePlay = () => {
        if (!isPlaying) {
            return play();
        }

        pause();
    }

    const onPlayNext = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex(id => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong) {
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    };

    const onPlayPrevious = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex(id => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if (!previousSong) {
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSong);
    };

    const toggleMute = () => {
        if (volume === 0) {
            return setVolume(1);
        }

        setVolume(0);
    }
 
    return (
        <div className='grid grid-cols-2 md:grid-cols-3 h-full'>
            <div className='flex w-full justify-start'>
                <div className='flex items-center gap-x-4'>
                    <MediaItem song={song}/>
                    <LikeButton songId={song.id} />
                </div>
            </div>

            {/* Mobile */}
            <div className='flex md:hidden col-auto w-full justify-end items-center'>
                <div 
                    className='h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer'
                    onClick={() => {}}
                >
                    <Icon 
                        className='text-black' 
                        size={30}
                        onClick={handlePlay} 
                    />
                </div>
            </div>

            {/* Desktop */}
            <div className='hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6'>
                <AiFillStepBackward
                    className='text-neutral-400 cursor-pointer hover:text-white transition'
                    size={30}
                    onClick={onPlayPrevious}
                />

                <div className='flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer'>
                    <Icon 
                        className='text-black' 
                        size={30}
                        onClick={handlePlay} 
                    />
                </div>

                <AiFillStepForward
                    className='text-neutral-400 cursor-pointer hover:text-white transition'
                    size={30}
                    onClick={onPlayNext}
                />
            </div>

            <div className='hidden md:flex w-full justify-end pr-2'>
                <div className='flex items-center gap-x-2 w-[120px]'>
                    <VolumeIcon 
                        className='cursor-pointer'
                        size={30}
                        onClick={toggleMute}
                    />

                    <Slider 
                        value={volume}
                        onChange={setVolume}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayerContent;