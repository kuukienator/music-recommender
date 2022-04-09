declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: (...args: any[]) => void;
        Spotify: {
            Player: (...args: any[]) => any;
        };
    }
}
