import { useEffect, useMemo, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import { Song } from '@/types/songs';

const useGetSong = (id?: string) => {
    const [song, setSong] = useState<Song | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const { supabaseClient } = useSessionContext();
    
    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchSong = async () => {
            const { data, error } = await supabaseClient.from('songs').select('*').eq('id', id).single();

            if (error) {
                setIsLoading(false);
                toast.error('An error has occurred while fetching the song.')
            }

            setSong(data as Song);
            setIsLoading(false);
        };

        fetchSong();
    }, [id, supabaseClient]);
    
    return useMemo(() => ({
        isLoading, song
    }), [isLoading, song]);
}

export default useGetSong;
