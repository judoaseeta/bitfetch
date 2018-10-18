import * as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './styles/Circle.scss';
const st = bind(styles);
const Circle: React.SFC<{
    cx: number;
    cy: number;
    r: number;
    selected: boolean;
    onMouseEnter?: React.MouseEventHandler<SVGCircleElement>;
}> = ({ cx, cy, r, onMouseEnter, selected, }) => (
    <circle
        className={st('circle', {
            selected: selected
        })}
        cx={cx}
        cy={cy}
        r={r}
        onMouseEnter={onMouseEnter}
    />
);

export default Circle;
