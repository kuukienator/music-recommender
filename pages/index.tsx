import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
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
import { filterListByIds, JourneySteps, scrollToTop } from '../lib/util';
import GenreGrid from '../components/GenreGrid';
import Header from '../components/Header';
import Button from '../components/Button';
import {
    getId,
    GlobalContext,
    MessageType,
} from '../components/GlobalProvider';

type SelectionJourneyStep =
    | JourneySteps.ChooseArtists
    | JourneySteps.ChooseGenres
    | JourneySteps.ChooseTracks;

type HasNext = Record<SelectionJourneyStep, boolean>;

const defaultHasNext: HasNext = {
    [JourneySteps.ChooseArtists]: false,
    [JourneySteps.ChooseGenres]: false,
    [JourneySteps.ChooseTracks]: false,
};

const Home: NextPage = () => {
    const { clearMessages, addMessage } = useContext(GlobalContext);

    const [journeyStep, setJourneyStep] = useState<JourneySteps>(
        JourneySteps.Loading
    );
    const [user, setCurrentUser] = useState<User | undefined>(undefined);
    const [topTracks, setTopTracks] = useState<Array<Track>>([]);
    const [topArtists, setTopArtists] = useState<Array<Artist>>([]);
    const [genres, setGenres] = useState<Array<string>>([]);
    const [hasNextData, setHasNextData] = useState<HasNext>({
        ...defaultHasNext,
    });

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
    const [showInformation, toggleShowInformation] = useState<boolean>(false);

    const getSelectionCount = (): number => {
        return (
            selectedTrackIds.length +
            selectedArtistIs.length +
            selectedGenres.length
        );
    };

    const getTopTracks = async (page = 0) => {
        const { items: tracks, hasNext } = await getTopItems<Track>(
            ItemType.Tracks,
            timeRange,
            page
        );
        setTopTracks(page === 0 ? tracks : [...topTracks, ...tracks]);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setCurrentPage(page);
        setJourneyStep(JourneySteps.ChooseTracks);
        setHasNextData({
            ...hasNextData,
            [JourneySteps.ChooseTracks]: hasNext,
        });
    };

    const getTopArtists = async (page = 0) => {
        const { items: artists, hasNext } = await getTopItems<Artist>(
            ItemType.Artists,
            timeRange,
            page
        );
        setTopArtists(page === 0 ? artists : [...topArtists, ...artists]);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setCurrentPage(page);
        setJourneyStep(JourneySteps.ChooseArtists);
        setHasNextData({
            ...hasNextData,
            [JourneySteps.ChooseArtists]: hasNext,
        });
    };

    const getGenres = async () => {
        const genres = await getMusicGenres();
        setGenres(genres);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setJourneyStep(JourneySteps.ChooseGenres);
        setHasNextData({ ...hasNextData, [JourneySteps.ChooseGenres]: false });
    };

    const loadMore = () => {
        switch (journeyStep) {
            case JourneySteps.ChooseTracks:
                getTopTracks(currentPage + 1);
                break;
            case JourneySteps.ChooseArtists:
                getTopArtists(currentPage + 1);
                break;
            default:
                break;
        }
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
        setJourneyStep(JourneySteps.ShowRecommendations);
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
            } else {
                addMessage({
                    text: 'You can only select 5 items.',
                    title: 'Selection warning',
                    type: MessageType.Warning,
                    id: getId(),
                    timeout: 2000,
                });
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
        setCurrentPreview(track);
    };

    const addToPlaylist = (track: Track) => {
        setTrackToAdd(track);
    };

    const reset = () => {
        setJourneyStep(JourneySteps.Start);
        setSelectedArtistIs([]);
        setSelectedTrackIds([]);
        setSelectedGenres([]);
        setTopArtists([]);
        setTopTracks([]);
        setGenres([]);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setHasNextData({ ...defaultHasNext });
        clearMessages();
    };

    const loginHandler = async () => {
        await login();
        const user = await getCurrentUser();
        setCurrentUser(user);
    };

    useEffect(() => {
        getCurrentUser().then((user) => {
            if (user) {
                setCurrentUser(user);
                setJourneyStep(JourneySteps.Start);
            } else {
                setJourneyStep(JourneySteps.Login);
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
                currentStep={journeyStep}
                getTopArtists={getTopArtists}
                getTopTracks={getTopTracks}
                reset={reset}
                login={loginHandler}
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

            {journeyStep === JourneySteps.ChooseTracks && (
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
            {journeyStep === JourneySteps.ChooseArtists && (
                <ArtistGrid
                    artists={topArtists}
                    selectedArtistIs={selectedArtistIs}
                    toggleArtistSelection={toggleArtistSelection}
                />
            )}
            {journeyStep === JourneySteps.ChooseGenres && (
                <GenreGrid
                    genres={genres}
                    toggleGenreSelection={toggleGenreSelection}
                    selectedGenres={selectedGenres}
                />
            )}
            {hasNextData[journeyStep as SelectionJourneyStep] && (
                <Button className="mb-2" onClick={loadMore}>
                    Load more
                </Button>
            )}
            {hasRecommendations && (
                <p className="text-lg my-2">Recommendtions:</p>
            )}
            {hasRecommendations && (
                <div className="flex flex-wrap justify-center text-white">
                    <TrackList
                        tracks={recommendedTracks}
                        selection={[]}
                        onAddToPlaylist={addToPlaylist}
                        onPlay={playPreview}
                    />
                </div>
            )}
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
