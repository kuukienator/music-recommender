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
    SpotifyImageSizes,
} from '../lib/spotify';
import clsx from 'clsx';
import TrackGrid, { TrackGridMode } from '../components/TrackGrid';
import SpotifyPlayer from '../components/SpotifyPlayer';
import TrackList from '../components/TrackList';
import Head from 'next/head';
import Button from '../components/Button';
import AddToPlaylistOverlay from '../components/AddToPlaylistOverlay';
import { getAlbumImage } from '../lib/image';
import RemoveIcon from '../icons/mono/remove.svg';
import SelectedItems from '../components/SelectedItems';
import ArtistGrid from '../components/ArtistGrid';
import InformationIcon from '../icons/mono/circle-information.svg';
import InformationOverlay from '../components/InformationOverlay';

const TIME_RANGE_OPTIONS: Array<{ label: string; value: TimeRange }> = [
    { label: 'Multipe Years', value: TimeRange.LongTerm },
    { label: 'Last 6 months', value: TimeRange.MediumTerm },
    { label: 'Last 4 weeks', value: TimeRange.ShortTerm },
];

enum TopMode {
    Tracks = 'tracks',
    Artists = 'artists',
    None = 'none',
}

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
    const [topMode, setTopMode] = useState<TopMode>(TopMode.None);
    const [showInformation, toggleShowInformation] = useState<boolean>(false);

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
        setTopMode(TopMode.Tracks);
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
        setTopMode(TopMode.Artists);
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
        setTopMode(TopMode.None);
        window.scrollTo(0, 0);
    };

    const toggleTrackSelection = (track: Track) => {
        if (selectedTrackIds.includes(track.id)) {
            setSelectedTrackIds(
                selectedTrackIds.filter((id) => id !== track.id)
            );
        } else {
            if (selectedTrackIds.length + selectedArtistIs.length < 5) {
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
            if (selectedTrackIds.length + selectedArtistIs.length < 5) {
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

    const reset = () => {
        setTopMode(TopMode.None);
        setSelectedArtistIs([]);
        setSelectedTrackIds([]);
        setTopArtists([]);
        setTopTracks([]);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
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
        <div className="min-h-screen flex items-center flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <Head>
                <title>Track Recommender | Powered by Spotify</title>
            </Head>
            <header className="flex w-full justify-between items-center px-2 max-w-screen-2xl">
                <div className="text-xl font-bold flex space-x-4">
                    <span>Track Recommender</span>
                    <InformationIcon
                        className="cursor-pointer"
                        onClick={() => toggleShowInformation(true)}
                    />
                </div>
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

            <div className="z-10 sticky flex w-full flex-col md:justify-center items-center py-2 space-y-2 md:space-y-0 md:space-x-2 top-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-b-2 border-white">
                <div className="flex flex-col space-y-2 mb-2 items-center">
                    <label htmlFor="time-range">
                        Time range:
                        <select
                            name="time-range"
                            className="ml-2 p-2 border-2 border-fuchsia-600 rounded-md text-white cursor-pointer bg-fuchsia-600 disabled:bg-gray-600"
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
                        <Button onClick={() => reset()}>Reset</Button>
                    </div>
                </div>
                {!hasRecommendations &&
                    (selectedArtistIs.length > 0 ||
                        selectedTrackIds.length > 0 ||
                        selectedGenres.length > 0) && (
                        <div className="relative w-full">
                            <SelectedItems
                                selectedTracks={selectedTrackIds
                                    .map((id) =>
                                        topTracks.find((e) => e.id === id)
                                    )
                                    .filter((e): e is Track => !!e)}
                                selectedArtists={selectedArtistIs
                                    .map((id) =>
                                        topArtists.find((e) => e.id === id)
                                    )
                                    .filter((e): e is Artist => !!e)}
                                toggleArtistSelection={toggleArtistSelection}
                                toggleTrackSelection={toggleTrackSelection}
                                onGetRecommendations={() => {
                                    getRecommendations(
                                        selectedTrackIds,
                                        selectedArtistIs,
                                        selectedGenres
                                    );
                                }}
                            />
                        </div>
                    )}
            </div>
            {topMode !== TopMode.None && <p>Select up to 5 items:</p>}
            <div className="flex flex-wrap justify-center">
                {topMode === TopMode.Tracks && (
                    <TrackGrid
                        tracks={topTracks}
                        selection={selectedTrackIds}
                        onTrackClick={toggleTrackSelection}
                        mode={
                            hasRecommendations
                                ? TrackGridMode.Compact
                                : TrackGridMode.Standard
                        }
                    />
                )}
            </div>

            {topMode === TopMode.Artists && (
                <ArtistGrid
                    artists={topArtists}
                    selectedArtistIs={selectedArtistIs}
                    toggleArtistSelection={toggleArtistSelection}
                />
            )}
            <div className="grid grid-cols-3 gap-2 ">
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

            {hasRecommendations && (
                <p className="text-lg my-2">Recommendtions:</p>
            )}
            <div className="flex flex-wrap justify-center text-white">
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
            {showInformation && (
                <InformationOverlay
                    onClose={() => toggleShowInformation(false)}
                />
            )}
            {/* <PreviewPlayer
                track={currentPreview?.preview_url ? currentPreview : undefined}
            /> */}
        </div>
    );
};

export default Home;
