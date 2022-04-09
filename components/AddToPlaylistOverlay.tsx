import React, { useEffect, useState, VFC } from 'react';
import {
    addTrackToPlaylist,
    getUserPlaylists,
    Playlist,
    Track,
} from '../lib/spotify';
import Overlay from './Overlay';

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
        <Overlay
            closeButtonText="Cancel"
            onClose={onClose}
            title="Select a playlist:"
        >
            <div className="overflow-y-scroll space-y-2 px-2 flex flex-col my-2">
                {playlists.map((playlist) => (
                    <button
                        className="bg-white bg-opacity-10 p-4 cursor-pointer shadow-md rounded-lg text-left hover:bg-opacity-30 active:blur-sm"
                        key={playlist.id}
                        onClick={() => {
                            addTrackToPlaylist(track.id, playlist.id).then(() =>
                                onClose()
                            );
                        }}
                    >
                        {playlist.name}
                    </button>
                ))}
            </div>
        </Overlay>
    );
};

export default AddToPlaylistOverlay;
