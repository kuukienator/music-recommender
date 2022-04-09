import React, { VFC } from 'react';
import { Track } from '../lib/spotify';
import Button from './Button';
import PlayIcon from '../icons/mono/play.svg';
import AddIcon from '../icons/mono/add.svg';

type Props = {
    tracks: Array<Track>;
    selection: Array<string>;
    onAddToPlaylist: (track: Track) => void;
    onPlay: (track: Track) => void;
};

const TrackList: VFC<Props> = ({ tracks, onAddToPlaylist, onPlay }) => {
    return (
        <div className="space-y-4 px-2">
            {tracks.map((track) => (
                <div
                    key={track.id}
                    className="flex items-center shadow-md justify-between"
                >
                    <div className="flex space-x-4 items-center">
                        <img
                            className="w-16 h-16"
                            src={track.album.images[0].url}
                            alt={track.name}
                        />
                        <div className="flex justify-center flex-col">
                            <p className="font-bold">{track.name}</p>
                            <p className="text-gray-500">
                                {track.artists[0].name}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2 mx-2">
                        <Button onClick={() => onPlay(track)}>
                            <PlayIcon className="text-white" />
                        </Button>
                        <Button onClick={() => onAddToPlaylist(track)}>
                            <AddIcon className="text-white" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrackList;
