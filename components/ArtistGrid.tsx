import clsx from 'clsx';
import React, { VFC } from 'react';
import { Artist } from '../lib/spotify';

type Props = {
    artists: Array<Artist>;
    selectedArtistIs: Array<string>;
    toggleArtistSelection: (artist: Artist) => void;
};

const ArtistGrid: VFC<Props> = ({
    artists,
    selectedArtistIs,
    toggleArtistSelection,
}) => (
    <div className="grid grid-cols-4 md:grid-cols-6  lg:grid-cols-8 max-w-screen-2xl gap-2 px-2">
        {artists.map((artist) => (
            <div
                key={artist.id}
                className={clsx('cursor-pointer', {
                    'border-2 border-red-500': selectedArtistIs.includes(
                        artist.id
                    ),
                })}
                onClick={() => toggleArtistSelection(artist)}
            >
                <img
                    className="aspect-square object-cover"
                    src={artist.images.length > 0 ? artist.images[0].url : ''}
                    alt={artist.name}
                />
                <p className="px-2">{artist.name}</p>
            </div>
        ))}
    </div>
);

export default ArtistGrid;
