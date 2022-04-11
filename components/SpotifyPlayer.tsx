import React, { useEffect, useState, VFC } from 'react';
import { playTrack, Track } from '../lib/spotify';
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
    const [player, setPlayer] = useState<Spotify.Player | null>(null);

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

                setPlayer(player);
            };
        });
    }, []);

    useEffect(() => {
        if (track) {
            if (deviceId) {
                playTrack(deviceId, track);
            }
        } else {
            if (player) {
                player.pause();
            }
        }
    }, [track, deviceId, player]);

    if (!track) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-transparent backdrop-blur border-t-2 border-white">
            <div className="flex items-center justify-between">
                <img
                    className="w-20 h-20"
                    src={track.album.images[0].url}
                    alt={track.name}
                />
                <div className="flex flex-col">
                    <span className="font-bold">{track?.name}</span>
                    <span className="font-light">{track?.artists[0].name}</span>
                </div>
                <div className="mr-2 space-x-2">
                    <Button
                        onClick={() => {
                            console.log('stopping', player);
                            player?.pause();
                        }}
                    >
                        <StopIcon className="text-white" />
                    </Button>
                    <Button onClick={() => onAddToPlaylist(track)}>
                        <AddIcon className="text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SpotifyPlayer;
