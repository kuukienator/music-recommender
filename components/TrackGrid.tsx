import clsx from 'clsx';
import React, { VFC } from 'react';
import { Track } from '../lib/spotify';
import TrackTile, { TrackTileMode } from './TrackTile';

export enum TrackGridMode {
    Standard = 'standard',
    Compact = 'compact',
}

type Props = {
    tracks: Array<Track>;
    selection: Array<string>;
    onTrackClick: (track: Track) => void;
    mode: TrackGridMode;
};

const TrackGrid: VFC<Props> = ({ tracks, onTrackClick, selection, mode }) => {
    return (
        <div
            className={clsx({
                'grid grid-cols-2 gap-y-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5':
                    mode === TrackGridMode.Standard,
                'grid grid-cols-5 gap-x-2 mx-2': mode === TrackGridMode.Compact,
            })}
        >
            {tracks.map((track) => (
                <TrackTile
                    key={track.id}
                    track={track}
                    onTrackClick={onTrackClick}
                    selected={selection.includes(track.id)}
                    mode={
                        mode === TrackGridMode.Standard
                            ? TrackTileMode.Standard
                            : TrackTileMode.Compact
                    }
                />
            ))}
        </div>
    );
};

export default TrackGrid;
