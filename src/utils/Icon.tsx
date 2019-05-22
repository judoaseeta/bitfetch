import * as React from 'react';

export interface IconProps {
    draws?:string[];
    fill?: string;
    size: string;
    vw?: string;
    vh?: string;
    st?: string;
    stw?: string;
}
const Icon: React.SFC<IconProps> = ({ children, draws, fill, size, st, stw, vw, vh }) => (
    <svg
        fill={fill? fill : 'none'}
        viewBox={`0 0 ${vw? vw : 100} ${vh? vh : 100}`}
    >
        {draws ? draws.map(d =>
            <path
                d={d}
                fill={fill? fill : 'none'}
                width={size}
                height={size}
                stroke={st ? st: 'black'}
                strokeWidth={stw ? stw : '15px'}
            />)
        : null}
        {children}
    </svg>
);

export default Icon;

