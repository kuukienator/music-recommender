import clsx from 'clsx';
import React, { VFC } from 'react';

type Props = {
    className?: string;
};

const PoweredBySpotify: VFC<Props> = ({ className }) => (
    <div
        className={clsx(
            'flex space-y-4 flex-col justify-center items-center',
            className
        )}
    >
        <p>Powered by:</p>
        <img
            className="w-40"
            src="/logos/Spotify_Logo_RGB_Black.png"
            alt="Spotify Logo"
        />
    </div>
);

export default PoweredBySpotify;
