'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import uniqid from 'uniqid';
import useUploadModal from '@/hooks/useUploadModal';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useUser } from '@/hooks/useUser';

type Props = {}

const UploadModal = (props: Props) => {
    const uploadModal = useUploadModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const { register, reset, handleSubmit } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null
        }
    });

    const onChange = (open: boolean) => {
        if (!open) {
            reset();

            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const songFile = values.song?.[0];
            const imageFile = values.image?.[0];

            if (!songFile || !imageFile || !user) {
                return toast.error('There are missing fields');
            }

            const uniqueId = uniqid();

            // Upload song
            const { 
                data: songData, 
                error: songError
            } = await supabaseClient.storage.from('songs').upload(`song-${values.title}-${uniqueId}`, songFile, {
                cacheControl: '3600',
                upsert: false
            });

            if (songError) {
                setIsLoading(false);

                return toast.error('An error has occurred while uploading the song.');
            }

            // Upload image
            const { 
                data: imageData, 
                error: imageError
            } = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueId}`, imageFile, {
                cacheControl: '3600',
                upsert: false
            });

            if (imageError) {
                setIsLoading(false);

                return toast.error('An error has occurred while uploading the image.');
            }

            // Save song to database
            const { error: supabaseError } = await supabaseClient.from('songs').insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                song_path: songData.path,
                image_path: imageData.path
            });

            if (supabaseError) {
                setIsLoading(false);

                return toast.error('An error has occurred while saving the song.');
            }

            router.refresh();

            setIsLoading(false);
            toast.success('Song uploaded successfully.');

            reset();
            uploadModal.onClose();
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            title='Upload Song'
            description='Upload your own song to the server.'
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form 
                className='flex flex-col gap-y-4' 
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input
                    id='title'
                    disabled={isLoading}
                    placeholder='Song title'
                    {...register('title', { required: true })}
                />

                <Input
                    id='author'
                    disabled={isLoading}
                    placeholder='Song author'
                    {...register('author', { required: true })}
                />

                <div>
                    <div className='pb-1'>
                        Song
                    </div>

                    <Input
                        id='song'
                        type='file'
                        disabled={isLoading}
                        accept='.mp3'
                        {...register('song', { required: true })}
                    />
                </div>

                <div>
                    <div className='pb-1'>
                        Cover
                    </div>

                    <Input
                        id='image'
                        type='file'
                        disabled={isLoading}
                        accept='image/*'
                        {...register('image', { required: true })}
                    />
                </div>

                <Button
                    type='submit'
                    disabled={isLoading}
                >
                    Upload
                </Button>
            </form>
        </Modal>
    );
};

export default UploadModal;