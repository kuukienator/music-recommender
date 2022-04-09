import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { getCurrentUser, login, User } from '../lib/spotify-auth';
import {
    getTopItems,
    getTrackRecommendations,
    ItemType,
    Track,
    TimeRange,
    Artist,
    getMusicGenres,
} from '../lib/spotify';
import clsx from 'clsx';
import TrackGrid, { TrackGridMode } from '../components/TrackGrid';
import SpotifyPlayer from '../components/SpotifyPlayer';
import TrackList from '../components/TrackList';
import Head from 'next/head';
import Button from '../components/Button';
import AddToPlaylistOverlay from '../components/AddToPlaylistOverlay';

const TIME_RANGE_OPTIONS: Array<{ label: string; value: TimeRange }> = [
    { label: 'Years', value: TimeRange.LongTerm },
    { label: 'Last 6 months', value: TimeRange.MediumTerm },
    { label: 'Last 4 weeks', value: TimeRange.ShortTerm },
];

const Home: NextPage = () => {
    const [user, setCurrentUser] = useState<User | undefined>(undefined);
    const [topTracks, setTopTracks] = useState<Array<Track>>([]);
    const [topArtists, setTopArtists] = useState<Array<Artist>>([]);
    const [genres, setGenres] = useState<Array<string>>([]);
    const [recommendedTracks, setRecommendedTracks] = useState<Array<Track>>(
        []
    );
    const [selectedTrackIds, setSelectedTrackIds] = useState<Array<string>>([]);
    const [selectedArtistIs, setSelectedArtistIs] = useState<Array<string>>([]);
    const [selectedGenres, setSelectedGenres] = useState<Array<string>>([]);
    const [hasRecommendations, toggleHasRecommendations] =
        useState<boolean>(false);

    const [currentPreview, setCurrentPreview] = useState<Track | undefined>();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.ShortTerm);
    const [trackToAdd, setTrackToAdd] = useState<Track | undefined>();

    const getTopTracks = async (page: number = 0) => {
        const tracks = await getTopItems<Track>(
            ItemType.Tracks,
            timeRange,
            page
        );
        setTopTracks(page === 0 ? tracks : [...topTracks, ...tracks]);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setCurrentPage(page + 1);
    };

    const getTopArtists = async (page: number = 0) => {
        const artists = await getTopItems<Artist>(
            ItemType.Artists,
            timeRange,
            page
        );
        setTopArtists(page === 0 ? artists : [...topArtists, ...artists]);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setCurrentPage(page + 1);
    };

    const getGenres = async () => {
        const genres = await getMusicGenres();
        setGenres(genres);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
    };

    const getRecommendations = async (
        trackIds: Array<string>,
        artistIds: Array<string>,
        genreIds: Array<string>
    ) => {
        const tracks = await getTrackRecommendations(
            trackIds,
            artistIds,
            genreIds
        );
        setRecommendedTracks(tracks);
        toggleHasRecommendations(true);
    };

    const toggleTrackSelection = (track: Track) => {
        if (selectedTrackIds.includes(track.id)) {
            setSelectedTrackIds(
                selectedTrackIds.filter((id) => id !== track.id)
            );
        } else {
            if (selectedTrackIds.length < 5) {
                setSelectedTrackIds([...selectedTrackIds, track.id]);
            }
        }
    };

    const toggleArtistSelection = (artist: Artist) => {
        if (selectedArtistIs.includes(artist.id)) {
            setSelectedArtistIs(
                selectedArtistIs.filter((id) => id !== artist.id)
            );
        } else {
            if (selectedArtistIs.length < 5) {
                setSelectedArtistIs([...selectedArtistIs, artist.id]);
            }
        }
    };

    const toggleGenreSelection = (genre: string) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((id) => id !== genre));
        } else {
            if (selectedGenres.length < 5) {
                setSelectedGenres([...selectedGenres, genre]);
            }
        }
    };

    const playPreview = (track: Track) => {
        console.log('playPreview', track);
        setCurrentPreview(track);
    };

    const addToPlaylist = (track: Track) => {
        setTrackToAdd(track);
    };

    useEffect(() => {
        getCurrentUser().then((user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                return login()
                    .then(() => getCurrentUser())
                    .then((user) => setCurrentUser(user));
            }
        });
    }, []);

    return (
        <div className="flex items-center flex-col">
            <Head>
                <title>Spotify Recommender</title>
            </Head>
            <header className="flex w-full justify-between items-center px-2">
                <div className="text-xl font-bold">Track Recommender</div>
                <div>
                    {user && (
                        <div className="flex justify-center flex-row items-center py-2 space-x-2">
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-8 h-8 object-cover"
                            />
                            <p className="text-center text-lg font-bold">
                                {user.name}
                            </p>
                        </div>
                    )}
                </div>
            </header>

            <div className="sticky flex w-full flex-col items-center top-0 bg-white border-b-2 border-green-700 py-2 space-y-2">
                <label htmlFor="time-range">
                    Time range:
                    <select
                        name="time-range"
                        className="ml-2 p-2 border-2 border-green-700 rounded-md"
                        value={timeRange}
                        onChange={(e) =>
                            setTimeRange(e.target.value as TimeRange)
                        }
                    >
                        {TIME_RANGE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex space-x-2">
                    <Button onClick={() => getTopTracks()}>
                        Get top tracks
                    </Button>
                    <Button onClick={() => getTopArtists()}>
                        Get top artists
                    </Button>
                    <Button onClick={() => getGenres()}>Get genres</Button>
                </div>
                <Button
                    onClick={() =>
                        getRecommendations(
                            selectedTrackIds,
                            selectedArtistIs,
                            selectedGenres
                        )
                    }
                    disabled={
                        selectedTrackIds.length === 0 &&
                        selectedArtistIs.length === 0 &&
                        selectedGenres.length === 0
                    }
                >
                    Get Recommendatons
                </Button>
            </div>
            {topTracks.length > 0 && <p>Select up to 5 tracks:</p>}
            <div className="flex flex-wrap justify-center">
                <TrackGrid
                    tracks={topTracks.filter((track) =>
                        hasRecommendations
                            ? selectedTrackIds.includes(track.id)
                            : true
                    )}
                    selection={selectedTrackIds}
                    onTrackClick={toggleTrackSelection}
                    mode={
                        hasRecommendations
                            ? TrackGridMode.Compact
                            : TrackGridMode.Standard
                    }
                />
                {!hasRecommendations && topTracks.length > 0 && (
                    <Button onClick={() => getTopTracks(currentPage)}>
                        Load more
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-4">
                {topArtists
                    .filter((artist) =>
                        hasRecommendations
                            ? selectedArtistIs.includes(artist.id)
                            : true
                    )
                    .map((artist) => (
                        <div
                            key={artist.id}
                            className={clsx({
                                'border-2 border-red-500':
                                    selectedArtistIs.includes(artist.id),
                            })}
                            onClick={() => toggleArtistSelection(artist)}
                        >
                            <img
                                className="aspect-square object-cover"
                                src={
                                    artist.images.length > 0
                                        ? artist.images[0].url
                                        : ''
                                }
                                alt={artist.name}
                            />
                            <p className="px-2">{artist.name}</p>
                        </div>
                    ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
                {genres
                    .filter((genre) =>
                        hasRecommendations
                            ? selectedGenres.includes(genre)
                            : true
                    )
                    .map((genre) => (
                        <div
                            key={genre}
                            onClick={() => toggleGenreSelection(genre)}
                            className={clsx(
                                'w-full aspect-square bg-green-500 rounded-md text-white font-bold flex justify-center items-center text-center uppercase',
                                {
                                    'border-2 border-red-500':
                                        selectedGenres.includes(genre),
                                }
                            )}
                        >
                            {genre}
                        </div>
                    ))}
            </div>

            {hasRecommendations && <p>Recommendtions:</p>}
            <div className="flex flex-wrap justify-center">
                <TrackList
                    tracks={recommendedTracks}
                    selection={[]}
                    onAddToPlaylist={addToPlaylist}
                    onPlay={playPreview}
                />
            </div>

            <SpotifyPlayer
                track={currentPreview}
                onAddToPlaylist={addToPlaylist}
            />
            {user && trackToAdd && (
                <AddToPlaylistOverlay
                    userId={user.id}
                    track={trackToAdd}
                    onClose={() => setTrackToAdd(undefined)}
                />
            )}
            {/* <PreviewPlayer
                track={currentPreview?.preview_url ? currentPreview : undefined}
            /> */}
        </div>
    );
};

export default Home;
