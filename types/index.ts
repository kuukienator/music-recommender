export {};

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: (...args: any[]) => void;
        Spotify: {
            Player: ({}: {
                name: string;
                volume: number;
                getOAuthToken: (cb: () => void) => void;
            }) => { addListener: () => void };
        };
    }
}
