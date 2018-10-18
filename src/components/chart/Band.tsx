import * as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './styles/Band.scss';

const cx = bind(styles);
const Band: React.SFC<{
    height: number;
    selected: boolean;
    x: number;
}> = ({ height, selected, x,}) => (
    <rect
        className={cx('band', {
            selected: selected
        })}
        x={x}
        y={0}
        width={1}
        height={height}
    />
);

export default Band;