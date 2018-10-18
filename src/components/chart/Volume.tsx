import * as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './styles/Volume.scss';
const cx = bind(styles);
const Volume: React.SFC<{
    selected: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
}> = ({ selected, x, y, width, height, }) => (
    <rect
        className={cx('volumeBar', {
            selected: selected
        })}
        x={x}
        y={y}
        width={width}
        height={height}
    />
);

export default Volume;