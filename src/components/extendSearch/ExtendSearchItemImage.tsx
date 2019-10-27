import * as React from 'react';

import LazyImage from '../../utils/component/LazyImage';
import * as PreviewImage from '../../files/coin_preview.png';

const ExtendSearchItemImage: React.FunctionComponent<{
    alt?: string;
    className: string;
    src: string;
}> = ({ alt, className, src }) => (
    <LazyImage
        alt={alt}
        className={className}
        previewSrc={PreviewImage}
        src={src}
    />
);

export default ExtendSearchItemImage;
