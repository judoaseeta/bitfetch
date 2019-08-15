import * as React from 'react';
import * as symbolStyles from './styles/Symbols.scss';
import {bind} from "classnames/bind";
const symbolStyle = bind(symbolStyles);
const CurrentSymbol: React.FunctionComponent<{
    current: number;
    flag: number;
}> = ({ current, flag }) => (
    <symbol
        className={symbolStyle('current', {
            up: flag === 1,
            down: flag === 2,
            same: flag === 4
        })}
        id="current"
        viewBox="0 0 50 25"
    >
        <rect
            x={4}
            y={4}
            rx={5}
            ry={5}
            width={46}
            height={19}
        />
        <text
            x={10}
            y={14}
            fontSize="9px"
            fill="white"
        >{current}</text>.
    </symbol>
);

export default CurrentSymbol;
