import * as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './styles/Stick.scss';

const cx = bind(styles);

const Stick: React.SFC<{
    close: number;
    open: number;
    selected: boolean;
    x: number;
    y: number;
    height: number;
}> = ({ close, open,selected, x, y, height, }) => (
    <rect
        className={cx('stick', {
            rise: close > open,
            fall: open > close,
            selected: selected
        })}
        width={1}
        x={x}
        y={y}
        height={height}
    />
);

export default Stick;

