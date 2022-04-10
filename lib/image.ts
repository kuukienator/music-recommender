import { Album, SpotifyImageSizes } from './spotify';

const getSmallestImage = (album: Album): string =>
    album.images.sort((a, b) => a.width - b.width)[0].url;

export const getAlbumImage = (
    album: Album,
    size: SpotifyImageSizes
): string => {
    const image = album.images.find((image) => image.width === size);
    return image ? image.url : getSmallestImage(album);
};
