import * as React from 'react'

const Current: React.SFC<{
    current: number,
    x: number,
    y: number
}> = ({ current, x, y, }) => {
    if (current) {
        return <use
            href="#current"
            x={x}
            y={y}
            width={50}
            height={25}
        />
    }
    return null;
};

export default Current;