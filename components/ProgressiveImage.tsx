import React, { useState, VFC } from 'react';

type Props = {
    src: string;
    loadingSrc: string;
    alt: string;
};

const ProgressiveImage: VFC<Props> = ({ alt, loadingSrc, src }) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    return (
        <div className="relative aspect-square">
            {!isLoaded && (
                <img
                    loading="lazy"
                    src={loadingSrc}
                    alt={alt}
                    className="w-full aspect-square blur-md absolute object-cover"
                />
            )}
            <img
                loading="lazy"
                src={src}
                alt={alt}
                className="w-full aspect-square absolute object-cover"
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
};
export default ProgressiveImage;
