import * as React from 'react';

const Indicator: React.SFC<{
    id: string;
    x: number;
    y: number;
}> = ({ id , x, y, }) => (
    <symbol
        id={id}
        x={x}
        y={y}
        viewBox="0 0 100 50"
    >
        <path
            d="M 20 2 L 1 24 L 20 49"
            fill="url(#grad3)"
            stroke='white'
            strokeWidth='1px'
        />
    </symbol>
);

export default Indicator;