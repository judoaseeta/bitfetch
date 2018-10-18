import * as React from 'react';
import Path from "./Path";

const Symbols: React.SFC<{
    current: number;
    data: any;
    selectedIndex: number;
    timeParser: (d: Date) => string | undefined;
}> = ({ current, data, selectedIndex, timeParser, }) => (
    <>
        <symbol
            id="indi1"
            viewBox="0 0 400 50"
        >
            <path
                d="M 20 2 L 1 25 L 20 48 L 398 48 L 398 2 Z"
                fill="url(#grad3)"
                stroke='white'
                strokeWidth='1px'
            />
            <text
                x={19}
                y={32.5}
                fontSize="20px"
                fill="white"
            >
                O:{selectedIndex > -1 && data[selectedIndex].open} C:{selectedIndex > -1 && data[selectedIndex].close}
                {'\u00A0'} L:{selectedIndex > -1 && data[selectedIndex].low} H:{selectedIndex > -1 && data[selectedIndex].high}
            </text>
        </symbol>
        <symbol
            id="indi2"
            viewBox="0 0 400 50"
        >
            <path
                d="M 2 2 L 2 48 L 380 48 L 398 25 L 380 2 Z"
                fill="url(#grad3)"
                stroke='white'
                strokeWidth='1px'
            />
            <text
                x={5}
                y={32.5}
                fontSize="20px"
                fill="white"
            >
                O:{selectedIndex > -1 && data[selectedIndex].open} C:{selectedIndex > -1 && data[selectedIndex].close}
                {'\u00A0'} L:{selectedIndex > -1 && data[selectedIndex].low} H:{selectedIndex > -1 && data[selectedIndex].high}
            </text>
        </symbol>
        <symbol
            id="indi3"
            viewBox="0 0 400 50"
        >
            <path
                d="M 20 2 L 1 25 L 20 48 L 398 48 L 398 2 Z"
                fill="url(#grad2)"
                stroke='white'
                strokeWidth='1px'
            />
            <text
                x={19}
                y={32.5}
                fontSize="20px"
                fill="white"
            >
                Volume: {selectedIndex > -1 && data[selectedIndex].volumefrom} /
            </text>
            <text
                x={380}
                y={32.5}
                fontSize="20px"
                fill="#fff200"
                style={{
                    textAnchor: 'end'
                }}
            >
                {selectedIndex > -1 && timeParser(data[selectedIndex].time)}
            </text>
        </symbol>
        <symbol
            id="indi4"
            viewBox="0 0 400 50"
        >
            <path
                d="M 2 2 L 2 48 L 380 48 L 398 25 L 380 2 Z"
                fill="url(#grad2)"
                stroke='white'
                strokeWidth='1px'
            />
            <text
                x={19}
                y={32.5}
                fontSize="20px"
                fill="white"
            >
                Volume: {selectedIndex > -1 && data[selectedIndex].volumefrom} /
            </text>
            <text
                x={380}
                y={32.5}
                fontSize="20px"
                fill="#fff200"
                style={{
                    textAnchor: 'end'
                }}
            >
                {selectedIndex > -1 && timeParser(data[selectedIndex].time)}
            </text>
        </symbol>
    </>
);
export default Symbols;