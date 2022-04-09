import React, { VFC } from 'react';
import Overlay from './Overlay';

type Props = {
    onClose: () => void;
};

const InformationOverlay: VFC<Props> = ({ onClose }) => (
    <Overlay onClose={onClose} title="Information" closeButtonText="Close">
        <div className="flex flex-col items-center space-y-4 p-4 text-center max-w-[80vw]">
            <p>
                Track recommender <br /> Get music recommendatons based on your
                top artists and songs.
            </p>

            <p>Powered by:</p>
            <img
                className="w-40"
                src="/logos/Spotify_Logo_RGB_Black.png"
                alt="Spotify Logo"
            />
            <p> Built by Emmanuel Meinike</p>
            <a
                href="https://twitter.com/kuukienator"
                target="_blank"
                rel="noreferrer"
                className="bg-white bg-opacity-10 p-2 cursor-pointer shadow-md rounded-md hover:bg-opacity-30"
            >
                @kuukienator
            </a>
            <p>2022</p>
        </div>
    </Overlay>
);

export default InformationOverlay;
