import React, { VFC } from 'react';
import Button from './Button';
import RemoveIcon from '../icons/mono/remove.svg';
import { Artist, Track } from '../lib/spotify';

type Props = {
    selectedTracks: Array<Track>;
    selectedArtists: Array<Artist>;
    selectedGenres: Array<string>;
    toggleTrackSelection: (track: Track) => void;
    toggleArtistSelection: (artist: Artist) => void;
    toggleGenreSelection: (genre: string) => void;
    onGetRecommendations: () => void;
};

const SelectedItems: VFC<Props> = ({
    selectedArtists,
    selectedTracks,
    selectedGenres,
    toggleArtistSelection,
    toggleTrackSelection,
    toggleGenreSelection,
    onGetRecommendations,
}) => {
    return (
        <div className="absolute w-full grid auto-rows-fr grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-2 pb-2 background-gradient border-b-2 border-white">
            {selectedTracks.map((track) => {
                return (
                    <div
                        key={track.id}
                        onClick={() => toggleTrackSelection(track)}
                        className="bg-white bg-opacity-10 rounded-md p-2 flex items-center space-x-2 justify-between"
                    >
                        {/*  <div>
                        <img
                            src={getAlbumImage(
                                track.album,
                                SpotifyImageSizes.Thumbnail
                            )}
                            className="w-8 h-8 aspect-square"
                            alt={track?.name}
                        />
                    </div> */}
                        <div className="flex flex-col text-sm overflow-hidden">
                            <span className="font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                                {track.name}
                            </span>
                            <span className="font-light text-ellipsis overflow-hidden whitespace-nowrap">
                                {track.artists[0].name}
                            </span>
                        </div>
                        <Button className="text-sm">
                            <RemoveIcon />
                        </Button>
                    </div>
                );
            })}
            {selectedArtists.map((artist) => {
                return (
                    <div
                        key={artist.id}
                        onClick={() => toggleArtistSelection(artist)}
                        className="bg-white bg-opacity-10 rounded-md p-2 flex items-center space-x-2 justify-between"
                    >
                        {/*  <div>
                        <img
                            src={getAlbumImage(
                                track.album,
                                SpotifyImageSizes.Thumbnail
                            )}
                            className="w-8 h-8 aspect-square"
                            alt={track?.name}
                        />
                    </div> */}
                        <div className="flex flex-col text-sm overflow-hidden">
                            <span className="font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                                {artist.name}
                            </span>
                        </div>
                        <Button className="text-sm">
                            <RemoveIcon />
                        </Button>
                    </div>
                );
            })}
            {selectedGenres.map((genre) => {
                return (
                    <div
                        key={genre}
                        onClick={() => toggleGenreSelection(genre)}
                        className="bg-white bg-opacity-10 rounded-md p-2 flex items-center space-x-2 justify-between"
                    >
                        <div className="flex flex-col text-sm overflow-hidden">
                            <span className="font-bold text-ellipsis overflow-hidden whitespace-nowrap uppercase">
                                {genre}
                            </span>
                        </div>
                        <Button className="text-sm">
                            <RemoveIcon />
                        </Button>
                    </div>
                );
            })}
            <Button
                onClick={onGetRecommendations}
                disabled={
                    selectedTracks.length === 0 &&
                    selectedArtists.length === 0 &&
                    selectedGenres.length === 0
                }
            >
                Get Recommendatons
            </Button>
        </div>
    );
};

export default SelectedItems;
