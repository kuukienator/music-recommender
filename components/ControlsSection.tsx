import clsx from 'clsx';
import React, { useEffect, useRef, useState, VFC } from 'react';
import { Artist, TimeRange, Track } from '../lib/spotify';
import { isStepBeforeChoosing, JourneySteps } from '../lib/util';
import Button from './Button';
import LinkButton from './LinkButton';
import PoweredBySpotify from './PoweredBySpotify';
import SelectedItems from './SelectedItems';

type Props = {
    timeRange: TimeRange;
    setTimeRange: (timeRange: TimeRange) => void;
    getTopTracks: () => void;
    getTopArtists: () => void;
    reset: () => void;
    login: () => void;
    onGetRecommendations: () => void;
    showSelectedItems: boolean;
    toggleArtistSelection: (artist: Artist) => void;
    toggleTrackSelection: (track: Track) => void;
    toggleGenreSelection: (genre: string) => void;
    selectedArtists: Artist[];
    selectedTracks: Track[];
    selectedGenres: string[];
    currentStep: JourneySteps;
};

const TIME_RANGE_OPTIONS: Array<{ label: string; value: TimeRange }> = [
    { label: 'Multipe Years', value: TimeRange.LongTerm },
    { label: 'Last 6 months', value: TimeRange.MediumTerm },
    { label: 'Last 4 weeks', value: TimeRange.ShortTerm },
];

const ControlsSection: VFC<Props> = ({
    setTimeRange,
    timeRange,
    getTopTracks,
    getTopArtists,
    reset,
    onGetRecommendations,
    showSelectedItems,
    toggleArtistSelection,
    toggleGenreSelection,
    toggleTrackSelection,
    selectedArtists,
    selectedTracks,
    selectedGenres,
    currentStep,
    login,
}) => {
    const containerRef = useRef(null);
    const [isSticked, toggleIsStickied] = useState<boolean>(false);

    const intersectCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                toggleIsStickied(false);
            } else {
                toggleIsStickied(true);
            }
        });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(intersectCallback, {
            rootMargin: '-1px 0px 0px 0px',
            threshold: [1],
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
            observer.disconnect();
        };
    }, [containerRef]);

    return (
        <div
            ref={containerRef}
            className={clsx(
                'z-10 sticky flex w-full flex-col md:justify-center items-center py-2 space-y-2 md:space-y-0 md:space-x-2 top-0 background-gradient',
                {
                    'border-b-2 border-white': isSticked,
                    'py-6 md:py-40 h-[90vh] justify-between md:justify-between':
                        isStepBeforeChoosing(currentStep),
                }
            )}
        >
            <div
                className={clsx('flex flex-col space-y-2 items-center', {
                    'space-y-4 md:max-w-[60vw] px-8':
                        isStepBeforeChoosing(currentStep),
                })}
            >
                {isStepBeforeChoosing(currentStep) && (
                    <div className="my-8 text-lg md:text-2xl text-center">
                        Get some recommendatons based on your past musicial
                        habits. Select you desired time range and select up to 5
                        of your past artists or tracks. Add songs you like to
                        your playlists and enjoy!
                    </div>
                )}
                {currentStep === JourneySteps.Start && (
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
                )}
                <div
                    className={clsx('flex space-x-2', {
                        'flex-col space-y-6 w-[40vw] space-x-0 lg:w-[30vw] xl:w-[20vw]':
                            isStepBeforeChoosing(currentStep),
                    })}
                >
                    {currentStep === JourneySteps.Loading && (
                        <div className="flex flex-col items-center space-y-5">
                            <div className="flex space-x-10">
                                <div className="w-6 h-6 rounded-full bg-white bg-opacity-40 animate-bounce"></div>
                                <div className="w-6 h-6 rounded-full bg-white bg-opacity-40 animate-bounce delay-100"></div>
                                <div className="w-6 h-6 rounded-full bg-white bg-opacity-40 animate-bounce"></div>
                            </div>
                            <p className="text-xl">Loading...</p>
                        </div>
                    )}
                    {currentStep === JourneySteps.Login && (
                        <Button onClick={() => login()}>
                            Login to Spotify
                        </Button>
                    )}

                    {currentStep === JourneySteps.Login && (
                        <LinkButton
                            href="mailto:emmanuel.meinike@gmail.com?subject=Requesting access to Music Recommender"
                            target="_blank"
                        >
                            Request preview access
                        </LinkButton>
                    )}
                    {currentStep === JourneySteps.Start && (
                        <>
                            <Button onClick={() => getTopTracks()}>
                                Choose your tracks
                            </Button>
                        </>
                    )}
                    {currentStep === JourneySteps.ChooseTracks && (
                        <>
                            <Button onClick={() => reset()}>Restart</Button>
                            <Button onClick={() => getTopArtists()}>
                                Choose your artists
                            </Button>
                        </>
                    )}
                    {currentStep === JourneySteps.ChooseArtists && (
                        <>
                            <Button onClick={() => reset()}>Restart</Button>
                            <Button onClick={() => getTopTracks()}>
                                Choose your tracks
                            </Button>
                        </>
                    )}

                    {currentStep === JourneySteps.ShowRecommendations && (
                        <Button onClick={() => reset()}>
                            Get new recommendations
                        </Button>
                    )}
                </div>
                {currentStep === JourneySteps.Login && (
                    <div>
                        <p className="text-sm text-center">
                            While app is in development, access must be
                            requested manually.
                        </p>
                    </div>
                )}
            </div>
            {isStepBeforeChoosing(currentStep) && (
                <PoweredBySpotify className="" />
            )}
            {showSelectedItems && (
                <>
                    {/* {(currentStep === JourneySteps.ChooseArtists ||
                        currentStep === JourneySteps.ChooseTracks) && (
                        <p>Select up to 5 items:</p>
                    )} */}
                    <div className="relative w-full pt-2">
                        <SelectedItems
                            selectedTracks={selectedTracks}
                            selectedArtists={selectedArtists}
                            selectedGenres={selectedGenres}
                            toggleArtistSelection={toggleArtistSelection}
                            toggleTrackSelection={toggleTrackSelection}
                            toggleGenreSelection={toggleGenreSelection}
                            onGetRecommendations={onGetRecommendations}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default ControlsSection;
