import clsx from 'clsx';
import React, { VFC } from 'react';

type Props = {
    genres: Array<string>;
    toggleGenreSelection: (genre: string) => void;
    selectedGenres: Array<string>;
};

const GenreGrid: VFC<Props> = ({
    genres,
    selectedGenres,
    toggleGenreSelection,
}) => (
    <div className="max-w-screen-2xl grid grid-cols-3 gap-2 auto-rows-fr sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 px-2 mb-2">
        {genres.map((genre) => (
            <div
                key={genre}
                onClick={() => toggleGenreSelection(genre)}
                className={clsx(
                    'w-full flex items-center justify-center cursor-pointer rounded-md bg-white bg-opacity-10 shadow-md hover:bg-opacity-30 text-center uppercase p-4',
                    {
                        'bg-opacity-70 text-black':
                            selectedGenres.includes(genre),
                    }
                )}
            >
                {genre}
            </div>
        ))}
    </div>
);

export default GenreGrid;
