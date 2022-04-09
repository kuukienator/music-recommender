import clsx from 'clsx';
import React, { VFC } from 'react';
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

const TrackTile: VFC<Props> = ({ track, onTrackClick, selected, mode }) => (
    <div
        key={track.id}
        onClick={() => onTrackClick(track)}
        className={clsx({
            'border-2 border-red-500':
                selected && mode === TrackTileMode.Standard,
        })}
    >
        <img
            src={getAlbumImage(track.album, SpotifyImageSizes.Small)}
            alt={track.album.name}
            className="w-full"
        />
        {mode === TrackTileMode.Standard && (
            <div className="px-2">
                <p className="font-bold">{track.name}</p>
                <p>{track.artists[0].name}</p>
            </div>
        )}
    </div>
);

export default TrackTile;
