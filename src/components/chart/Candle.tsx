import * as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './styles/Candle.scss';

const cx = bind(styles);

const Candle: React.SFC<{
    onMouseEnter?: React.MouseEventHandler<SVGRectElement>;
    selected?: boolean;
    unvisible?: boolean;
    close: number;
    open: number;
    height: number;
    width: number;
    x: number;
    y: number;
}> = ({ onMouseEnter, selected, unvisible, close, open, height, width, x, y, }) => (
    <rect
        className={cx('candleBar', {
            rise: close > open,
            fall: open > close,
            unvisible: unvisible,
            selected: selected,
        })}
        height={height}
        width={width}
        x={x}
        y={y}
        onMouseEnter={onMouseEnter}
    />
);
export default Candle;