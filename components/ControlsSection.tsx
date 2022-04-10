import clsx from 'clsx';
import React, { useEffect, useRef, useState, VFC } from 'react';
import { Artist, TimeRange, Track } from '../lib/spotify';
import Button from './Button';
import PoweredBySpotify from './PoweredBySpotify';
import SelectedItems from './SelectedItems';

type Props = {
    timeRange: TimeRange;
    setTimeRange: (timeRange: TimeRange) => void;
    getTopTracks: () => void;
    getTopArtists: () => void;
    reset: () => void;
    onGetRecommendations: () => void;
    showSelectedItems: boolean;
    toggleArtistSelection: (artist: Artist) => void;
    toggleTrackSelection: (track: Track) => void;
    toggleGenreSelection: (genre: string) => void;
    selectedArtists: Artist[];
    selectedTracks: Track[];
    selectedGenres: string[];
    isStartView: boolean;
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
    isStartView,
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
                    'py-20 md:py-40': isStartView,
                }
            )}
        >
            <div
                className={clsx('flex flex-col space-y-2 items-center', {
                    'space-y-4 md:max-w-[60vw] px-8': isStartView,
                })}
            >
                <div
                    className={clsx({
                        'mb-8 text-lg md:text-2xl': isStartView,
                        hidden: !isStartView,
                    })}
                >
                    Get some recommendatons based on your past musicial habits.
                    To start, load your top artists or music tracks and select
                    up to 5 of them. You can switch between them later to mix
                    and match. Add songs you like to your playlists and enjoy!
                </div>
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
                <div
                    className={clsx('flex space-x-2', {
                        'flex-col space-y-6 w-[40vw] space-x-0 lg:w-[30vw] xl:w-[20vw]':
                            isStartView,
                    })}
                >
                    <Button onClick={() => getTopTracks()}>
                        Get top tracks
                    </Button>
                    <Button onClick={() => getTopArtists()}>
                        Get top artists
                    </Button>
                    {/* <Button onClick={() => getGenres()}>Get genres</Button> */}
                    <Button onClick={() => reset()}>Reset</Button>
                </div>
                {isStartView && <PoweredBySpotify className="py-10" />}
            </div>
            {showSelectedItems && (
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
            )}
        </div>
    );
};

export default ControlsSection;
