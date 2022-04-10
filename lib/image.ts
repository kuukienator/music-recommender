import { Album, SpotifyImage, SpotifyImageSizes } from './spotify';

const getSmallestImage = (images: Array<SpotifyImage>): string =>
    images.length > 0 ? images.sort((a, b) => a.width - b.width)[0].url : '';

export const getAlbumImage = (album: Album, size: SpotifyImageSizes): string =>
    getSpotifyImage(album.images, size);

export const getSpotifyImage = (
    images: Array<SpotifyImage>,
    size: SpotifyImageSizes
) => {
    const image = images.find((image) => image.width === size);
    return image ? image.url : getSmallestImage(images);
};
