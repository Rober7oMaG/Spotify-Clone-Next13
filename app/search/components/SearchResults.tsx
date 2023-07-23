'use client';

import React from 'react';
import { Song } from '@/types/songs';
import MediaItem from '@/components/MediaItem';

type Props = {
  songs: Song[]
};

const SearchResults = ({ songs }: Props) => {
  if (songs.length === 0) {
    return (
      <div className='text-neutral-400 px-6'>
        No songs were found
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-y-2 w-full px-6'>
      {
        songs.map((song) => (
          <div
            key={song.id}
            className='flex items-center gap-x-4 w-full'
          >
            <div className='flex-1'>
              <MediaItem
                song={song}
                onClick={() => {}} 
              />
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default SearchResults;