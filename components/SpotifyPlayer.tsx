import React, { useEffect, useRef, useState, VFC } from 'react';
import { Track } from '../lib/spotify';
import { getAccessToken } from '../lib/spotify-auth';
import Button from './Button';
import AddIcon from '../icons/mono/add.svg';
import StopIcon from '../icons/mono/stop.svg';

type Props = {
    track?: Track;
    onAddToPlaylist: (track: Track) => void;
};

const SpotifyPlayer: VFC<Props> = ({ track, onAddToPlaylist }) => {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | undefined>(
        undefined
    );
    const [player, setPlayer] = useState<any>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        getAccessToken().then((accessToken) => {
            if (!accessToken) {
                return;
            }
            window.onSpotifyWebPlaybackSDKReady = () => {
                const token = accessToken;
                // @ts-ignore
                const player = new window.Spotify.Player({
                    name: 'Spotify Recommender App',
                    getOAuthToken: (cb: (token: string) => void) => cb(token),
                    volume: 0.5,
                });

                player.addListener(
                    'ready',
                    ({ device_id }: { device_id: string }) => {
                        setDeviceId(device_id);
                        console.log('Ready with Device ID', device_id);
                    }
                );

                player.addListener(
                    'not_ready',
                    ({ device_id }: { device_id: string }) => {
                        console.log('Device ID has gone offline', device_id);
                    }
                );

                player.connect();

                setAccessToken(accessToken);
                setPlayer(player);
            };
        });
    }, []);

    useEffect(() => {
        if (track) {
            fetch(
                `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ uris: [track.uri] }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
        }
    }, [track, deviceId, accessToken]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-green-700">
            {track && (
                <div className="flex items-center justify-between">
                    <img
                        className="w-20 h-20"
                        src={track.album.images[0].url}
                        alt={track.name}
                    />
                    <div className="flex flex-col">
                        <span className="font-bold">{track?.name}</span>
                        <span>{track?.artists[0].name}</span>
                    </div>
                    <div className="mr-2 space-x-2">
                        <Button
                            onClick={() => {
                                console.log('stopping', player);
                                player.pause();
                            }}
                        >
                            <StopIcon className="text-white" />
                        </Button>
                        <Button onClick={() => onAddToPlaylist(track)}>
                            <AddIcon className="text-white" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpotifyPlayer;
