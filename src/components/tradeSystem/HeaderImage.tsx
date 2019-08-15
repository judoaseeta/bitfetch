import * as React from 'react';

import LazyImage from '../../utils/LazyImage';

import * as styles  from './styles/HeaderImage.scss';
import * as previewImage from '../../files/coin_preview.png';

const HeaderImage: React.FunctionComponent<{
    src: string;
}> = ({ src }) => (
    <LazyImage
        className={styles.img}
        previewSrc={previewImage}
        src={src}
    />
);

export default HeaderImage;
