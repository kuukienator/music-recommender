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
    <div className="grid auto-rows-fr grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 max-w-screen-2xl gap-2 px-2 mb-2">
        {artists.map((artist) => (
            <div
                key={artist.id}
                className={clsx(
                    'cursor-pointer rounded-md bg-white bg-opacity-10 shadow-md p-2 hover:bg-opacity-30',
                    {
                        'bg-opacity-70 text-black': selectedArtistIs.includes(
                            artist.id
                        ),
                    }
                )}
                onClick={() => toggleArtistSelection(artist)}
            >
                <img
                    className="aspect-square object-cover w-full"
                    src={artist.images.length > 0 ? artist.images[0].url : ''}
                    alt={artist.name}
                />
                <p className="px-2 mt-2">{artist.name}</p>
            </div>
        ))}
    </div>
);

export default ArtistGrid;
