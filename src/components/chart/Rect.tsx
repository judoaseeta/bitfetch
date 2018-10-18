import * as React from 'react';
import * as styles from './styles/Rect.scss';

const Rect: React.SFC<{
    x: number;
    y: number;
    width: number;
    height: number;
}> = ({ x, y, width, height }) => (
    <rect
        className={styles.rect}
        x={x}
        y={y}
        width={width}
        height={height}
    />
);

export default Rect;