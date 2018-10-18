import * as React from 'react';
import Path from "./Path";
import Rect from "./Rect";

const Loading: React.SFC<{
    width: number;
    height: number;
}> = ({ width, height, }) => (
    <svg
        viewBox='0 0 700 400'
        width='100%'
        height='100%'
    >
        <symbol
            id="loading"
            viewBox="0 0 260 200"
        >
            <Path
                d="M255 188L30 188L30 22L55 22L55 158L80 158L80 52L105 52L105 158L130 158L130 82L155 82L155 158L180 158L180 112L205 112L205 158L230 158
                        L 230 142 L 255 142 L 255 188 Z"
                type="loading"
            />
        </symbol>
        <g>
            <Rect
                x={0}
                y={0}
                width={width}
                height={height}
            />
            <use
                href="#loading"
                x={width / 2 - (width / 4)}
                y={height / 2 - (height / 4)}
                width={width / 2}
                height={height / 2}
            />
        </g>
    </svg>
);

export default Loading;

