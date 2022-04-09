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
            onClick={(e) => {
                console.log('closing', e);
            }}
            className="bg-black fixed inset-0 bg-opacity-80 flex items-center justify-center"
        >
            <div className="max-h-[80%] bg-white flex flex-col m-2 shadow-md rounded-md">
                <div className="text-center text-lg border-b-2 border-green-700 font-bold p-2">
                    Select a playlist:
                </div>
                <div className="overflow-scroll space-y-2 divide-y-2">
                    {playlists.map((playlist) => (
                        <div
                            className="p-2"
                            key={playlist.id}
                            onClick={() => {
                                addTrackToPlaylist(track.id, playlist.id).then(
                                    () => onClose()
                                );
                            }}
                        >
                            {playlist.name}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center p-2 border-t-2 border-green-700">
                    <Button onClick={() => onClose()}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default AddToPlaylistOverlay;
