import React, { useEffect, useState, VFC } from 'react';
import {
    addTrackToPlaylist,
    getUserPlaylists,
    Playlist,
    Track,
} from '../lib/spotify';
import Button from './Button';

type Props = {
    userId: string;
    track: Track;
    onClose: () => void;
};

const AddToPlaylistOverlay: VFC<Props> = ({ userId, track, onClose }) => {
    const [playlists, setPlayLists] = useState<Array<Playlist>>([]);
    useEffect(() => {
        getUserPlaylists(userId).then((playlists) => setPlayLists(playlists));
    }, [userId]);

    return (
        <div
            onClick={() => onClose()}
            className="bg-black fixed inset-0 bg-opacity-60 flex items-center justify-center backdrop-blur z-20"
        >
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className="max-h-[80%] min-w-fit bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col m-2 shadow-md rounded-md"
            >
                <div className="text-center text-lg font-bold p-2">
                    Select a playlist:
                </div>
                <div className="overflow-y-scroll space-y-2 px-2 flex flex-col my-2">
                    {playlists.map((playlist) => (
                        <button
                            className="bg-white bg-opacity-10 p-4 cursor-pointer shadow-md rounded-lg text-left hover:bg-opacity-30 active:blur-sm"
                            key={playlist.id}
                            onClick={() => {
                                addTrackToPlaylist(track.id, playlist.id).then(
                                    () => onClose()
                                );
                            }}
                        >
                            {playlist.name}
                        </button>
                    ))}
                </div>
                <div className="flex justify-center p-2">
                    <Button onClick={() => onClose()}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default AddToPlaylistOverlay;
