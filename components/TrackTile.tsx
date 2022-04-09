import clsx from 'clsx';
import React, { useState, VFC } from 'react';
import { getAlbumImage } from '../lib/image';
import { SpotifyImageSizes, Track } from '../lib/spotify';

export enum TrackTileMode {
    Standard = 'standard',
    Compact = 'compact',
}

type Props = {
    track: Track;
    onTrackClick: (track: Track) => void;
    selected?: boolean;
    mode: TrackTileMode;
};

const TrackTile: VFC<Props> = ({ track, onTrackClick, selected, mode }) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    return (
        <div
            key={track.id}
            onClick={() => onTrackClick(track)}
            className={clsx(
                'cursor-pointer rounded-md bg-white bg-opacity-10 shadow-md p-2 hover:bg-opacity-30',
                {
                    'bg-opacity-70 text-black':
                        selected && mode === TrackTileMode.Standard,
                }
            )}
        >
            <div className="relative aspect-square">
                {!isLoaded && (
                    <img
                        loading="lazy"
                        src={getAlbumImage(
                            track.album,
                            SpotifyImageSizes.Thumbnail
                        )}
                        alt={track.album.name}
                        className="w-full aspect-square blur-md absolute"
                    />
                )}
                <img
                    loading="lazy"
                    src={getAlbumImage(track.album, SpotifyImageSizes.Medium)}
                    alt={track.album.name}
                    className="w-full aspect-square absolute"
                    onLoad={() => setIsLoaded(true)}
                />
            </div>
            {mode === TrackTileMode.Standard && (
                <div className="mt-2">
                    <p className="font-bold">{track.name}</p>
                    <p className="font-light">{track.artists[0].name}</p>
                </div>
            )}
        </div>
    );
};

export default TrackTile;
