import React, { VFC } from 'react';
import { Artist, TimeRange, Track } from '../lib/spotify';
import Button from './Button';
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
}) => {
    return (
        <div className="z-10 sticky flex w-full flex-col md:justify-center items-center py-2 space-y-2 md:space-y-0 md:space-x-2 top-0 background-gradient border-b-2 border-white">
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
                    {/* <Button onClick={() => getGenres()}>Get genres</Button> */}
                    <Button onClick={() => reset()}>Reset</Button>
                </div>
            </div>
            {showSelectedItems && (
                <div className="relative w-full">
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
