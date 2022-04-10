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
import TrackGrid, { TrackGridMode } from '../components/TrackGrid';
import SpotifyPlayer from '../components/SpotifyPlayer';
import TrackList from '../components/TrackList';
import Head from 'next/head';
import AddToPlaylistOverlay from '../components/AddToPlaylistOverlay';
import ArtistGrid from '../components/ArtistGrid';
import InformationOverlay from '../components/InformationOverlay';
import ControlsSection from '../components/ControlsSection';
import { filterListByIds, scrollToTop } from '../lib/util';
import GenreGrid from '../components/GenreGrid';
import Header from '../components/Header';

enum TopMode {
    Tracks = 'tracks',
    Artists = 'artists',
    Genres = 'genres',
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

    const getSelectionCount = (): number => {
        return (
            selectedTrackIds.length +
            selectedArtistIs.length +
            selectedGenres.length
        );
    };

    const getTopTracks = async (page = 0) => {
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

    const getTopArtists = async (page = 0) => {
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
        setTopMode(TopMode.Genres);
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
        scrollToTop();
    };

    const toggleSelection = (
        selection: Array<string>,
        id: string,
        selectedCount: number,
        setter: (selection: Array<string>) => void
    ) => {
        if (selection.includes(id)) {
            setter(selection.filter((entry) => entry !== id));
        } else {
            if (selectedCount < 5) {
                setter([...selection, id]);
            }
        }
    };

    const toggleTrackSelection = (track: Track) => {
        toggleSelection(
            selectedTrackIds,
            track.id,
            getSelectionCount(),
            setSelectedTrackIds
        );
    };

    const toggleArtistSelection = (artist: Artist) => {
        toggleSelection(
            selectedArtistIs,
            artist.id,
            getSelectionCount(),
            setSelectedArtistIs
        );
    };

    const toggleGenreSelection = (genre: string) => {
        toggleSelection(
            selectedGenres,
            genre,
            getSelectionCount(),
            setSelectedGenres
        );
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
        setSelectedGenres([]);
        setTopArtists([]);
        setTopTracks([]);
        setGenres([]);
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
        <div className="min-h-screen flex items-center flex-col background-gradient">
            <Head>
                <title>Track Recommender | Powered by Spotify</title>
            </Head>
            <Header user={user} toggleShowInformation={toggleShowInformation} />

            <ControlsSection
                isStartView={topMode === TopMode.None && !hasRecommendations}
                getTopArtists={getTopArtists}
                getTopTracks={getTopTracks}
                reset={reset}
                onGetRecommendations={() => {
                    getRecommendations(
                        selectedTrackIds,
                        selectedArtistIs,
                        selectedGenres
                    );
                }}
                selectedArtists={filterListByIds<Artist>(
                    topArtists,
                    selectedArtistIs
                )}
                selectedTracks={filterListByIds<Track>(
                    topTracks,
                    selectedTrackIds
                )}
                selectedGenres={selectedGenres}
                setTimeRange={setTimeRange}
                timeRange={timeRange}
                toggleArtistSelection={toggleArtistSelection}
                toggleGenreSelection={toggleGenreSelection}
                toggleTrackSelection={toggleTrackSelection}
                showSelectedItems={
                    !hasRecommendations && getSelectionCount() > 0
                }
            />

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
            {topMode === TopMode.Genres && (
                <GenreGrid
                    genres={genres}
                    toggleGenreSelection={toggleGenreSelection}
                    selectedGenres={selectedGenres}
                />
            )}

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
