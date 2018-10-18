import * as React from 'react';

const Gradient: React.SFC<{
    id: string;
    rgb1: string;
    rgb2: string;
}> = ({ id, rgb1, rgb2, }) => (
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{
            stopColor: rgb1,
            stopOpacity: 1
        }} />
        <stop offset="100%" style={{
            stopColor: rgb2,
            stopOpacity: 1
        }} />
    </linearGradient>
);

export default Gradient;
