import { fetchWithToken } from './spotify-auth';

export enum ItemType {
    Artists = 'artists',
    Tracks = 'tracks',
}

export enum TimeRange {
    LongTerm = 'long_term',
    MediumTerm = 'medium_term',
    ShortTerm = 'short_term',
}

export enum SpotifyImageSizes {
    Thumbnail = 64,
    Small = 300,
    Medium = 640,
}

export type SpotifyImage = {
    height: SpotifyImageSizes;
    width: SpotifyImageSizes;
    url: string;
};

export type Album = {
    uri: string;
    name: string;
    images: Array<SpotifyImage>;
};

export type TrackArtist = {
    id: string;
    name: string;
    uri: string;
};

export type Track = {
    id: string;
    uri: string;
    name: string;
    preview_url: string;
    album: Album;
    artists: Array<TrackArtist>;
    external_urls: { spotify: string };
};

export type Artist = {
    id: string;
    uri: string;
    name: string;
    genres: Array<string>;
    images: Array<SpotifyImage>;
};

export type Playlist = {
    id: string;
    uri: string;
    name: string;
};

export const getTopItems = async <T>(
    type: ItemType,
    timeRange: TimeRange,
    page: number = 0
): Promise<Array<T>> => {
    const limit = 40;
    const offset = page * limit;
    const res = await fetchWithToken(
        `https://api.spotify.com/v1/me/top/${type}?limit=${limit}&time_range=${timeRange}&offset=${offset}`
    );

    const data = await res.json();

    console.log(page, data);

    return data.items as Array<T>;
};

export const getTrackRecommendations = async (
    trackIds: Array<string>,
    artistIds: Array<string>,
    genreIds: Array<string>
): Promise<Array<Track>> => {
    const limit = 100;
    const seed_tracks = trackIds.join(',');
    const artists_tracks = artistIds.slice(0, 5 - trackIds.length).join(',');
    const seed_genres = genreIds
        .slice(0, 5 - (trackIds.length + artistIds.length))
        .join(',');

    const res = await fetchWithToken(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks}&seed_artists=${artists_tracks}&seed_genres=${seed_genres}&limit=${limit}`
    );

    const data = await res.json();

    console.log(data);

    return data.tracks as Array<Track>;
};

export const getMusicGenres = async (): Promise<Array<string>> => {
    const res = await fetchWithToken(
        'https://api.spotify.com/v1/recommendations/available-genre-seeds'
    );

    const data = await res.json();

    console.log(data);

    return data.genres as Array<string>;
};

export const getUserPlaylists = async (
    userId: string
): Promise<Array<Playlist>> => {
    const res = await fetchWithToken(
        `https://api.spotify.com/v1/users/${userId}/playlists?limit=50`
    );

    const data = await res.json();

    console.log(data);

    return data.items as Array<Playlist>;
};

export const addTrackToPlaylist = async (
    trackId: string,
    playlistId: string
) => {
    const res = await fetchWithToken(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=spotify:track:${trackId}`,
        {
            method: 'POST',
        }
    );

    const data = await res.json();

    console.log(data);
};
