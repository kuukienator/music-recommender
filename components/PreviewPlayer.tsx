import React, { useEffect, useRef, VFC } from 'react';
import { Track } from '../lib/spotify';

type Props = {
    track?: Track;
};

const PreviewPlayer: VFC<Props> = ({ track }) => {
    const audioPlayer = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        console.log(track?.name);
        if (audioPlayer.current) {
            if (track?.preview_url) {
                audioPlayer.current.play();
            } else {
                audioPlayer.current.pause();
            }
        }
    }, [track]);

    useEffect(() => {
        if (audioPlayer.current) {
            audioPlayer.current.volume = 0.25;
        }
    }, [audioPlayer]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white flex flex-col border-t-2 border-green-700">
            {track && (
                <span className="px-4 py-2">
                    {track?.name} - {track?.artists[0].name}
                </span>
            )}
            <audio
                className="w-full"
                ref={audioPlayer}
                controls
                src={track?.preview_url}
            ></audio>
        </div>
    );
};

export default PreviewPlayer;
