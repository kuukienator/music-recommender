import React, { VFC } from 'react';
import { SpotifyImageSizes, Track } from '../lib/spotify';
import Button from './Button';
import PlayIcon from '../icons/mono/play.svg';
import StopIcon from '../icons/mono/stop.svg';
import AddIcon from '../icons/mono/add.svg';
import { getAlbumImage } from '../lib/image';

type Props = {
    tracks: Array<Track>;
    currentPreviewTrack?: Track;
    selection: Array<string>;
    onAddToPlaylist: (track: Track) => void;
    onPlay: (track: Track) => void;
    onStop: () => void;
};

const TrackList: VFC<Props> = ({
    tracks,
    onAddToPlaylist,
    onPlay,
    onStop,
    currentPreviewTrack,
}) => (
    <div className="grid grid-cols-1 auto-rows-fr space-y-4 px-2 max-w-screen-2xl md:space-y-0 md:auto-rows-fr md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-2 lg:gap-4 xl:grid-cols-4">
        {tracks.map((track) => (
            <div
                key={track.id}
                className="flex items-center shadow-md justify-between bg-white bg-opacity-10 rounded-md hover:bg-opacity-30 px-2"
            >
                <a
                    className="flex space-x-4 items-center"
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        className="w-16 h-16 aspect-square"
                        src={getAlbumImage(
                            track.album,
                            SpotifyImageSizes.Thumbnail
                        )}
                        alt={track.name}
                    />
                    <div className="flex justify-center flex-col py-2">
                        {/* TODO: check if this element style is sufficient */}
                        <p className="font-bold max-h-12 overflow-hidden">
                            {track.name}
                        </p>
                        <p className="text-white font-light">
                            {track.artists[0].name}
                        </p>
                    </div>
                </a>
                <div className="flex space-x-2 mx-2">
                    {(!currentPreviewTrack ||
                        currentPreviewTrack.id !== track.id) && (
                        <Button onClick={() => onPlay(track)}>
                            <PlayIcon className="text-white" />
                        </Button>
                    )}
                    {currentPreviewTrack?.id === track.id && (
                        <Button onClick={() => onStop()}>
                            <StopIcon className="text-white" />
                        </Button>
                    )}
                    <Button onClick={() => onAddToPlaylist(track)}>
                        <AddIcon className="text-white" />
                    </Button>
                </div>
            </div>
        ))}
    </div>
);

export default TrackList;
